import { Message /* , log as wechatyLog */ } from 'wechaty';

import { global } from '../../utils/global';
import * as cache from '../../utils/cache';

const message = (m) => {
  // (m: Message)
  if (m.self()) {
    // ignore sent message
    return;
  }
  const one = m.from();
  const group = m.room();
  // id
  global.requestor.id().then((id) => {
    // cache
    cache.set(id, { message: m, one, group });
    // additional data
    const promiseList = [
      one.alias(), // [0]
      group ? group.alias(one).catch(() => {
        // conceal a bug
        // https://github.com/wechaty/wechaty-puppet-puppeteer/issues/122
      }) : Promise.resolve(undefined), // [1]
      group ? group.topic() : Promise.resolve(undefined), // [2]
    ];
    Promise.all(promiseList).then((resultList) => {
      // log
      global.requestor.log({
        id,
        instance: global.setting.wechaty.name,
        level: 'INFO',
        category: 'wechat-connector.listener.wechat.message',
        timestampMs: Date.now(),
        content: JSON.stringify({
          messageType: Message.Type[m.type()], // string
          messageText: m.type() === Message.Type.Text ? m.text() : '', // string
          messageFile: '', // string
          messageFileName: '', // string
          messageTimestampMs: m.date().valueOf(), // number as long
          messageAgeMs: m.age() * 1000, // number as long
          oneId: one.id, // string
          oneName: one.name(), // string
          oneAlias: typeof resultList[0] === 'string' ? resultList[0] : '', // string
          oneAliasInGroup: typeof resultList[1] === 'string' ? resultList[1] : '', // string
          oneIsFriend: one.friend() ? true : false, // boolean
          groupId: group ? group.id : '', // string
          groupName: typeof resultList[2] === 'string' ? resultList[2] : '', // string
        }),
      });
    });
  });
};

export { message };
