import * as cache from '../utils/cache';
import { global } from '../utils/global';

import { Message } from 'wechaty';

const logError = async (reason, contextType, payload) => {
  // (reason: string, callerType: string, payload: object)
  await global.requestor.log({
    instance: global.setting.wechaty.name,
    id: await global.requestor.getId(),
    level: 'error',
    type: 'wechat-worker.requestor.wechat.error',
    timestamp: Date.now(),
    content: {
      reason, // string
      contextType, // string
      contextRequest: JSON.stringify(payload), // string
    },
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
    // eslint-disable-next-line max-len
    await logError('message expired', 'wechat-worker.requestor.wechat.forward', payload);
    return;
  }
  let recipient;
  if (payload.receiver.category === 'friend') {
    // to friend
    if (payload.receiver.isAlias) {
      // eslint-disable-next-line max-len
      recipient = await global.robot.Contact.find({ alias: payload.receiver.name });
    } else {
      // eslint-disable-next-line max-len
      recipient = await global.robot.Contact.find({ name: payload.receiver.name });
    }
    if (!recipient) {
      // eslint-disable-next-line max-len
      await logError('friend not found', 'wechat-worker.requestor.wechat.forward', payload);
      return;
    }
    // forward
    await context.content.message.forward(recipient);
    // log
    await global.requestor.log({
      instance: global.setting.wechaty.name,
      id: await global.requestor.getId(),
      level: 'info',
      type: 'wechat-worker.requestor.wechat.forward',
      timestamp: Date.now(),
      content: {
        messageId: context.content.message.id, // string
        messageType: Message.Type[context.content.message.type()], // string
        // eslint-disable-next-line max-len
        messageText: context.content.message.type() === Message.Type.Text ? context.content.message.text() : '', // string
        receiverId: recipient.id, // string
        receiverType: 'friend', // string
        receiverName: recipient.name(), // string
      },
    });
  } else if (payload.receiver.category === 'group') {
    // to group
    recipient = await global.robot.Room.find({ topic: payload.receiver.name });
    if (!recipient) {
      // eslint-disable-next-line max-len
      await logError('group not found', 'wechat-worker.requestor.wechat.forward', payload);
      return;
    }
    // forward
    await context.content.message.forward(recipient);
    // log
    await global.requestor.log({
      instance: global.setting.wechaty.name,
      id: await global.requestor.getId(),
      level: 'info',
      type: 'wechat-worker.requestor.wechat.forward',
      timestamp: Date.now(),
      content: {
        messageId: context.content.message.id, // string
        messageType: Message.Type[context.content.message.type()], // string
        // eslint-disable-next-line max-len
        messageText: context.content.message.type() === Message.Type.Text ? context.content.message.text() : '', // string
        receiverId: recipient.id, // string
        receiverType: 'group', // string
        receiverName: recipient.topic(), // string
      },
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
    // eslint-disable-next-line max-len
    await logError('message expired', 'wechat-worker.requestor.wechat.reply', payload);
    return;
  }
  if (context.content.group) {
    // from one in group
    //
    // reply
    context.content.group.say(payload.message, context.content.one);
    // log
    await global.requestor.log({
      instance: global.setting.wechaty.name,
      id: await global.requestor.getId(),
      level: 'info',
      type: 'wechat-worker.requestor.wechat.reply',
      timestamp: Date.now(),
      content: {
        messageText: payload.message, // string
        receiverId: context.content.group.id, // string
        receiverType: 'group', // string
        receiverName: context.content.group.topic(), // string
      },
    });
  } else {
    // from friend
    //
    // reply
    context.content.one.say(payload.message);
    // log
    await global.requestor.log({
      instance: global.setting.wechaty.name,
      id: await global.requestor.getId(),
      level: 'info',
      type: 'wechat-worker.requestor.wechat.reply',
      timestamp: Date.now(),
      content: {
        messageText: payload.message, // string
        receiverId: context.content.one.id, // string
        receiverType: 'friend', // string
        receiverName: context.content.one.name(), // string
      },
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
      // eslint-disable-next-line max-len
      recipient = await global.robot.Contact.find({ alias: payload.receiver.name });
    } else {
      // eslint-disable-next-line max-len
      recipient = await global.robot.Contact.find({ name: payload.receiver.name });
    }
    if (!recipient) {
      // eslint-disable-next-line max-len
      await logError('friend not found', 'wechat-worker.requestor.wechat.send', payload);
      return;
    }
    // send
    await recipient.say(payload.message);
    // log
    await global.requestor.log({
      instance: global.setting.wechaty.name,
      id: await global.requestor.getId(),
      level: 'info',
      type: 'wechat-worker.requestor.wechat.send',
      timestamp: Date.now(),
      content: {
        messageText: payload.message, // string
        receiverId: recipient.id, // string
        receiverType: 'friend', // string
        receiverName: recipient.name(), // string
      },
    });
  } else if (payload.receiver.category === 'group') {
    // to group
    recipient = await global.robot.Room.find({ topic: payload.receiver.name });
    if (!recipient) {
      // eslint-disable-next-line max-len
      await logError('group not found', 'wechat-worker.requestor.wechat.send', payload);
      return;
    }
    // send
    await recipient.say(payload.message);
    // log
    await global.requestor.log({
      instance: global.setting.wechaty.name,
      id: await global.requestor.getId(),
      level: 'info',
      type: 'wechat-worker.requestor.wechat.send',
      timestamp: Date.now(),
      content: {
        messageText: payload.message, // string
        receiverId: recipient.id, // string
        receiverType: 'group', // string
        receiverName: recipient.topic(), // string
      },
    });
  }
};

export { forward, reply, send };
