import * as cache from '../utils/cache';
import { global } from '../utils/global';

import { Contact, Message, Room } from 'wechaty';

const logError = async (reason, contextType, payload) => {
  // (reason: string, callerType: string, payload: object)
  global.requestor.log({
    id: await global.requestor.id(),
    instance: global.setting.wechaty.name,
    level: 'ERR',
    category: 'wechat-worker.requestor.wechat.error',
    timestampMs: Date.now(),
    content: JSON.stringify({
      reason, // string
      contextType, // string
      contextRequest: JSON.stringify(payload), // string
    }),
  });
};

const checkRobot = async (contextType, payload) => {
  // (callerType: string, payload: object)
  if (!global.robot) {
    await logError('robot non-existent', contextType, payload);
    return false;
  }
  if (!global.robot.logonoff()) {
    await logError('robot logged-out', contextType, payload);
    return false;
  }
  return true;
};

const forward = async (payload) => {
  // (payload: object)
  if (!await checkRobot('forward', payload)) {
    return;
  }
  const context = cache.get(payload.id);
  if (!context) {
    await logError('message expired', 'wechat-worker.requestor.wechat.forward', payload);
    return;
  }
  let recipient;
  if (payload.receiver.category === 'friend') {
    // to friend
    if (payload.receiver.isAlias) {
      recipient = await global.robot.Contact.find({ alias: payload.receiver.name });
    } else {
      recipient = await global.robot.Contact.find({ name: payload.receiver.name });
    }
    if (!recipient) {
      await logError('friend not found', 'wechat-worker.requestor.wechat.forward', payload);
      return;
    }
    try {
      // forward
      await context.message.forward(recipient);
    } catch (error) {
      await logError(error.message, 'wechat-worker.requestor.wechat.forward', payload);
      return;
    }
    // log
    global.requestor.log({
      id: await global.requestor.id(),
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.requestor.wechat.forward',
      timestampMs: Date.now(),
      content: JSON.stringify({
        messageId: context.message.id, // string
        messageType: Message.Type[context.message.type()], // string
        messageText: context.message.type() === Message.Type.Text ? context.message.text() : '', // string
        receiverId: recipient.id, // string
        receiverType: 'friend', // string
        receiverName: recipient.name(), // string
      }),
    });
  } else if (payload.receiver.category === 'group') {
    // to group
    recipient = await global.robot.Room.find({ topic: payload.receiver.name });
    if (!recipient) {
      await logError('group not found', 'wechat-worker.requestor.wechat.forward', payload);
      return;
    }
    try {
      // forward
      await context.message.forward(recipient);
    } catch (error) {
      await logError(error.message, 'wechat-worker.requestor.wechat.forward', payload);
      return;
    }
    // log
    global.requestor.log({
      id: await global.requestor.id(),
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.requestor.wechat.forward',
      timestampMs: Date.now(),
      content: JSON.stringify({
        messageId: context.message.id, // string
        messageType: Message.Type[context.message.type()], // string
        messageText: context.message.type() === Message.Type.Text ? context.message.text() : '', // string
        receiverId: recipient.id, // string
        receiverType: 'group', // string
        receiverName: await recipient.topic(), // string
      }),
    });
  }
};

const reply = async (payload) => {
  // (payload: object)
  if (!await checkRobot('reply', payload)) {
    return;
  }
  const context = cache.get(payload.id);
  if (!context) {
    await logError('message expired', 'wechat-worker.requestor.wechat.reply', payload);
    return;
  }
  if (context.group) {
    // from one in group
    //
    try {
      // reply
      context.group.say(payload.message, context.one);
    } catch (error) {
      await logError(error.message, 'wechat-worker.requestor.wechat.reply', payload);
      return;
    }
    // log
    global.requestor.log({
      id: await global.requestor.id(),
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.requestor.wechat.reply',
      timestampMs: Date.now(),
      content: JSON.stringify({
        messageText: payload.message, // string
        receiverId: context.group.id, // string
        receiverType: 'group', // string
        receiverName: await context.group.topic(), // string
      }),
    });
  } else {
    // from friend
    //
    try {
      // reply
      context.one.say(payload.message);
    } catch (error) {
      await logError(error.message, 'wechat-worker.requestor.wechat.reply', payload);
      return;
    }
    // log
    global.requestor.log({
      id: await global.requestor.id(),
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.requestor.wechat.reply',
      timestampMs: Date.now(),
      content: JSON.stringify({
        messageText: payload.message, // string
        receiverId: context.one.id, // string
        receiverType: 'friend', // string
        receiverName: context.one.name(), // string
      }),
    });
  }
};

const send = async (payload) => {
  // (payload: object)
  if (!await checkRobot('send', payload)) {
    return;
  }
  let recipient;
  if (payload.receiver.category === 'friend') {
    // to friend
    if (payload.receiver.isAlias) {
      recipient = await global.robot.Contact.find({ alias: payload.receiver.name });
    } else {
      recipient = await global.robot.Contact.find({ name: payload.receiver.name });
    }
    if (!recipient) {
      await logError('friend not found', 'wechat-worker.requestor.wechat.send', payload);
      return;
    }
    try {
      // send
      await recipient.say(payload.message);
    } catch (error) {
      await logError(error.message, 'wechat-worker.requestor.wechat.send', payload);
      return;
    }
    // log
    global.requestor.log({
      id: await global.requestor.id(),
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.requestor.wechat.send',
      timestampMs: Date.now(),
      content: JSON.stringify({
        messageText: payload.message, // string
        receiverId: recipient.id, // string
        receiverType: 'friend', // string
        receiverName: recipient.name(), // string
      }),
    });
  } else if (payload.receiver.category === 'group') {
    // to group
    recipient = await global.robot.Room.find({ topic: payload.receiver.name });
    if (!recipient) {
      await logError('group not found', 'wechat-worker.requestor.wechat.send', payload);
      return;
    }
    try {
      // send
      await recipient.say(payload.message);
    } catch (error) {
      await logError(error.message, 'wechat-worker.requestor.wechat.send', payload);
      return;
    }
    // log
    global.requestor.log({
      id: await global.requestor.id(),
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.requestor.wechat.send',
      timestampMs: Date.now(),
      content: JSON.stringify({
        messageText: payload.message, // string
        receiverId: recipient.id, // string
        receiverType: 'group', // string
        receiverName: await recipient.topic(), // string
      }),
    });
  }
};

const syncAll = async () => {
  if (!await checkRobot('sync', null)) {
    return;
  }
  const promiseList = [];
  await Promise.all([
    global.robot.Contact.findAll().then((resultList) => {
      resultList.forEach((contact) => {
        promiseList.push(sync(contact));
      });
    }),
    global.robot.Room.findAll().then((resultList) => {
      resultList.forEach((room) => {
        promiseList.push(sync(room));
      });
    }),
  ]);
  await Promise.all(promiseList);
  await global.requestor.log({
    id: await global.requestor.id(),
    instance: global.setting.wechaty.name,
    level: 'INFO',
    category: 'wechat-worker.requestor.wechat.sync-all',
    timestampMs: Date.now(),
    content: '{}',
  });
};

const sync = async (obj) => {
  let payload;
  if (obj instanceof Contact) {
    payload = {
      objectType: 'friend',
      objectName: obj.name(),
    };
  } else if (obj instanceof Room) {
    payload = {
      objectType: 'group',
      objectName: await obj.topic(),
    };
  } else {
    // invalid type
    return;
  }
  await obj.sync();
  await global.requestor.log({
    id: await global.requestor.id(),
    instance: global.setting.wechaty.name,
    level: 'INFO',
    category: 'wechat-worker.requestor.wechat.sync',
    timestampMs: Date.now(),
    content: JSON.stringify(payload),
  });
};

export { forward, reply, send, syncAll, sync };
