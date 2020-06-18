import * as cache from '../utils/cache';
import { global } from '../utils/global';

const checkRobot = async (caller, payload) => {
  // (caller: string, payload: object)
  if (!global.robot) {
    await global.requestor.log({
      id: await global.requestor.getId(),
      level: 'error',
      type: `${global.setting.wechaty.name}.requestor.wechat.${caller}`,
      content: { reason: 'robot non-existent', payload },
      timestamp: Date.now(),
    });
    return false;
  }
  if (!global.robot.logonoff()) {
    await global.requestor.log({
      id: await global.requestor.getId(),
      level: 'error',
      type: `${global.setting.wechaty.name}.requestor.wechat.${caller}`,
      content: { reason: 'robot logged-out', payload },
      timestamp: Date.now(),
    });
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
    await global.requestor.log({
      id: await global.requestor.getId(),
      level: 'error',
      type: `${global.setting.wechaty.name}.requestor.wechat.forward`,
      content: { reason: 'message expired', payload },
      timestamp: Date.now(),
    });
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
      await global.requestor.log({
        id: await global.requestor.getId(),
        level: 'error',
        type: `${global.setting.wechaty.name}.requestor.wechat.forward`,
        content: { reason: 'friend not found', payload },
        timestamp: Date.now(),
      });
      return;
    }
    // forward
    await context.content.message.forward(recipient);
    // success
    await global.requestor.log({
      id: await global.requestor.getId(),
      level: 'info',
      type: `${global.setting.wechaty.name}.requestor.wechat.forward`,
      content: { payload, context },
      timestamp: Date.now(),
    });
  } else if (payload.receiver.category === 'group') {
    // to group
    recipient = await global.robot.Room.find({ topic: payload.receiver.name });
    if (!recipient) {
      await global.requestor.log({
        id: await global.requestor.getId(),
        level: 'error',
        type: `${global.setting.wechaty.name}.requestor.wechat.forward`,
        content: { reason: 'group not found', payload },
        timestamp: Date.now(),
      });
      return;
    }
    // forward
    await context.content.message.forward(recipient);
    // shorten (too long for log)
    delete recipient.payload.memberIdList;
    // success
    await global.requestor.log({
      id: await global.requestor.getId(),
      level: 'info',
      type: `${global.setting.wechaty.name}.requestor.wechat.forward`,
      content: { payload, context },
      timestamp: Date.now(),
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
    await global.requestor.log({
      id: await global.requestor.getId(),
      level: 'error',
      type: `${global.setting.wechaty.name}.requestor.wechat.reply`,
      content: { reason: 'message expired', payload },
      timestamp: Date.now(),
    });
    return;
  }
  if (context.content.group) {
    // from one in group
    //
    // reply
    context.content.group.say(payload.message, context.content.one);
    // shorten (too long for log)
    delete context.content.group.payload.memberIdList;
    // success
    await global.requestor.log({
      id: await global.requestor.getId(),
      level: 'info',
      type: `${global.setting.wechaty.name}.requestor.wechat.reply`,
      content: {
        payload,
        one: context.content.one,
        group: context.content.group,
      },
      timestamp: Date.now(),
    });
  } else {
    // from friend
    //
    // reply
    context.content.one.say(payload.message);
    // success
    await global.requestor.log({
      id: await global.requestor.getId(),
      level: 'info',
      type: `${global.setting.wechaty.name}.requestor.wechat.reply`,
      content: {
        payload,
        friend: context.content.one,
      },
      timestamp: Date.now(),
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
    if (payload.receiver.isAlias) {
      // eslint-disable-next-line max-len
      recipient = await global.robot.Contact.find({ alias: payload.receiver.name });
    } else {
      // eslint-disable-next-line max-len
      recipient = await global.robot.Contact.find({ name: payload.receiver.name });
    }
    if (!recipient) {
      await global.requestor.log({
        id: await global.requestor.getId(),
        level: 'error',
        type: `${global.setting.wechaty.name}.requestor.wechat.send`,
        content: { reason: 'friend not found', payload },
        timestamp: Date.now(),
      });
      return;
    }
    // send
    await recipient.say(payload.message);
    // success
    await global.requestor.log({
      id: await global.requestor.getId(),
      level: 'info',
      type: `${global.setting.wechaty.name}.requestor.wechat.send`,
      content: { payload, recipient },
      timestamp: Date.now(),
    });
  } else if (payload.receiver.category === 'group') {
    recipient = await global.robot.Room.find({ topic: payload.receiver.name });
    if (!recipient) {
      await global.requestor.log({
        id: await global.requestor.getId(),
        level: 'error',
        type: `${global.setting.wechaty.name}.requestor.wechat.send`,
        content: { reason: 'group not found', payload },
        timestamp: Date.now(),
      });
      return;
    }
    // send
    await recipient.say(payload.message);
    // shorten (too long for log)
    delete recipient.payload.memberIdList;
    // success
    global.requestor.getId().then((id) => {
      global.requestor.log({
        id,
        level: 'info',
        type: `${global.setting.wechaty.name}.requestor.wechat.send`,
        content: { payload, recipient },
        timestamp: Date.now(),
      });
    });
  }
};

export { forward, reply, send };
