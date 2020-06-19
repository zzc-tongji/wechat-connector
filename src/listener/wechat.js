import { ScanStatus } from 'wechaty';

import { global } from '../utils/global';
import * as cache from '../utils/cache';

const dong = (/* data */) => {
  // (data?: string)
  global.requestor.getId().then((id) => {
    global.requestor.log({
      instance: global.setting.wechaty.name,
      id,
      level: 'info',
      type: 'wechat-worker.listener.wechat.dong',
      timestamp: Date.now(),
      // content: null,
    });
  });
};

const error = (error) => {
  // (error: Error)
  global.requestor.getId().then((id) => {
    global.requestor.log({
      instance: global.setting.wechaty.name,
      id,
      level: 'info',
      type: 'wechat-worker.listener.wechat.error',
      timestamp: Date.now(),
      content: {
        name: error.name, // string
        message: error.message, // string
      },
    });
  });
};

/*
const friendship = (friendship) => {
  // (friendship: Friendship)
};
*/

const heatbeat = (/* data */) => {
  // (data: any)
  global.requestor.getId().then((id) => {
    global.requestor.log({
      instance: global.setting.wechaty.name,
      id,
      level: 'info',
      type: 'wechat-worker.listener.wechat.heatbeat',
      timestamp: Date.now(),
      // content: null,
    });
  });
};

const login = (user) => {
  // (user: ContactSelf)
  global.requestor.getId().then((id) => {
    global.requestor.log({
      instance: global.setting.wechaty.name,
      id,
      level: 'info',
      type: 'wechat-worker.listener.wechat.login',
      timestamp: Date.now(),
      content: {
        name: user.name(), // string
      },
    });
  });
};

const logout = (user, reason) => {
  // (user: ContactSelf, reason?: string)
  global.requestor.getId().then((id) => {
    global.requestor.log({
      instance: global.setting.wechaty.name,
      id,
      level: 'info',
      type: 'wechat-worker.listener.wechat.logout',
      timestamp: Date.now(),
      content: {
        name: user.name(), // string
        reason, // string
      },
    });
  });
};

const message = async (m) => {
  // TODO: split log and cache, update log
  //
  // (m: Message)
  if (m.self()) {
    // ingore sent message
    return;
  }
  // content
  const content = { message: m };
  const one = m.from();
  const group = m.room();
  if (group) {
    // from group => { message, one, group }
    content.one = one;
    content.group = group;
    // shorten (too long for log)
    delete content.group.payload.memberIdList;
  } else {
    // from friend => { message, friend }
    content.friend = one;
  }
  // log
  const payload = {
    instance: global.setting.wechaty.name,
    id: await global.requestor.getId(),
    level: 'info',
    type: 'wechat-worker.listener.wechat.message',
    content,
    timestamp: Date.now(),
  };
  await global.requestor.log(payload);
  // cache
  cache.set(payload.id, payload);
};

const ready = () => {
  global.requestor.getId().then((id) => {
    global.requestor.log({
      instance: global.setting.wechaty.name,
      id,
      level: 'info',
      type: 'wechat-worker.listener.wechat.ready',
      timestamp: Date.now(),
      // content: null,
    });
  });
};

/*
const roomInvite = (roomInvitation) => {
  // (roomInvitation: RoomInvitation)
  //
  // TODO: bug - event connot be emitted.
};

const roomJoin = (room, inviteeList, inviter, date) => {
  // (room: Room, inviteeList: Contact[], inviter: Contact, date?: Date)
};

const roomLeave = (room, leaverList) => {
  // (room: Room, leaverList: Contact[],  remover?: Contact, date?: Date)
};

const roomTopic = (room, newTopic, oldTopic, changer, date) => {
  // (room: Room, newTopic: string, oldTopic: string,
  // changer: Contact, date?: Date)
};
*/

const scan = (qrcode, status) => {
  // (qrcode: string, status: ScanStatus, data?: string)
  global.loginApproach.status = ScanStatus[status];
  global.loginApproach.url = qrcode;
  global.loginApproach.qrcode = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');
  global.loginApproach.timestamp = Date.now();
  //
  global.requestor.getId().then((id) => {
    global.requestor.log({
      instance: global.setting.wechaty.name,
      id,
      level: 'info',
      type: 'wechat-worker.listener.wechat.scan',
      timestamp: Date.now(),
      content: {
        status: global.loginApproach.status, // string
        url: global.loginApproach.url, // string
        qrcode: global.loginApproach.qrcode, // string
        timestamp: global.loginApproach.timestamp, // number as long
      },
    });
  });
};

const start = () => {
  global.requestor.getId().then((id) => {
    global.requestor.log({
      instance: global.setting.wechaty.name,
      id,
      level: 'info',
      type: 'wechat-worker.listener.wechat.start',
      timestamp: Date.now(),
      // content: null,
    });
  });
};

const stop = () => {
  global.requestor.getId().then((id) => {
    global.requestor.log({
      instance: global.setting.wechaty.name,
      id,
      level: 'info',
      type: 'wechat-worker.listener.wechat.stop',
      timestamp: Date.now(),
      // content: null,
    });
  });
};

const listen = () => {
  // event
  global.robot.on('dong', dong);
  global.robot.on('error', error);
  // global.robot.on('friendship', friendship);
  global.robot.on('heatbeat', heatbeat);
  global.robot.on('login', login);
  global.robot.on('logout', logout);
  global.robot.on('message', message);
  global.robot.on('ready', ready);
  // global.robot.on('room-invite', roomInvite);
  // global.robot.on('room-join', roomJoin);
  // global.robot.on('room-leave', roomLeave);
  // global.robot.on('room-topic', roomTopic);
  global.robot.on('scan', scan);
  global.robot.on('start', start);
  global.robot.on('stop', stop);
};

export { listen };
