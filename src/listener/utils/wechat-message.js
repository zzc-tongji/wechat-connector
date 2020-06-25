import { Message /* , log as wechatyLog */ } from 'wechaty';

import { global } from '../../utils/global';
import * as cache from '../../utils/cache';

/*
const dev = process.env.DEV ? true : false;

const getFileBase64 = async (message) => {
  // There is a bug which may terminate the whole process.
  // https://github.com/wechaty/wechaty-puppet-puppeteer/issues/124
  try {
    if (message.type() === Message.Type.Text) {
      return undefined;
    } else {
      const file = await message.toFileBox();
      if (file) {
        return {
          base64: await file.toBase64(),
          name: file.name,
        };
      }
      return undefined;
    }
  } catch (e) {
    wechatyLog.error('local.listener.wechat.message.file', JSON.stringify(error));
    console.log();
    return undefined;
  }
};
*/

const message = (m) => {
  // (m: Message)
  if (m.self()) {
    // ingore sent message
    return;
  }
  const one = m.from();
  const group = m.room();
  // id
  global.requestor.id().then((id) => {
    const promiseList = [
      one.alias(), // [0]
      group ? group.alias(one).catch(() => {
        // conceal a bug
        // https://github.com/wechaty/wechaty-puppet-puppeteer/issues/122
      }) : Promise.resolve(undefined), // [1]
      group ? group.topic() : Promise.resolve(undefined), // [2]
      Promise.resolve(undefined), // getFileBase64(m), // [3]
    ];
    Promise.all(promiseList).then((resultList) => {
      // log
      global.requestor.log({
        id,
        instance: global.setting.wechaty.name,
        level: 'info',
        category: 'wechat-worker.listener.wechat.message',
        timestamp: Date.now(),
        content: {
          messageType: Message.Type[m.type()], // string
          messageText: m.type() === Message.Type.Text ? m.text() : '', // string
          messageFileBase64: '', // resultList[3] ? (dev ? '[base64-encoded]' : resultList[3].base64) : '', // string
          messageFileName: '', // resultList[3] ? resultList[3].name : '', // string
          messageTimestamp: m.date().valueOf(), // number as long
          messageAgeMillisecond: m.age() * 1000, // number as long
          oneId: one.id, // string
          oneName: one.name(), // string
          oneAlias: typeof resultList[0] === 'string' ? resultList[0] : '', // string
          oneAliasInGroup: typeof resultList[1] === 'string' ? resultList[1] : '', // string
          oneIsFriend: one.friend() ? true : false, // boolean
          groupId: group ? group.id : '', // string
          groupName: typeof resultList[2] === 'string' ? resultList[2] : '', // string
        },
      });
    });
    // cache
    cache.set(id, { message: m, one, group });
  });
};

export { message };
