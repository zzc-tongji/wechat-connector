import { ScanStatus } from 'wechaty';

import * as notLoginAfterStart from '../utils/report/not-login-after-start';
import * as unexpectedLogout from '../utils/report/unexpected-logout';
import { global } from '../utils/global';
import { message } from './utils/wechat-message';

import * as autoStart from '../utils/auto-start';

const dong = (data) => {
  // (data?: string)
  global.requestor.id().then((id) => {
    global.requestor.log({
      instance: global.setting.wechaty.name,
      id,
      level: 'INFO',
      type: 'wechat-worker.listener.wechat.dong',
      timestampMs: Date.now(),
      content: '{}',
    });
  });
};

const error = (error) => {
  // (error: Error)
  global.requestor.id().then((id) => {
    global.requestor.log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.listener.wechat.error',
      timestampMs: Date.now(),
      content: JSON.stringify({
        name: error.name, // string
        message: error.message, // string
      }),
    }).then(() => {
      autoStart.set(true);
      global.stop().then(() => {
        process.exit(1);
      });
    });
  });
};

/*
const friendship = (friendship) => {
  // (friendship: Friendship)
};
*/

const heatbeat = (data) => {
  // (data: any)
  global.requestor.id().then((id) => {
    global.requestor.log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.listener.wechat.heatbeat',
      timestampMs: Date.now(),
      content: '{}',
    });
  });
};

const login = (user) => {
  // (user: ContactSelf)
  global.requestor.id().then((id) => {
    global.requestor.log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.listener.wechat.login',
      timestampMs: Date.now(),
      content: JSON.stringify({
        name: user.name(), // string
      }),
    });
  });
  notLoginAfterStart.disable();
  // reset
  unexpectedLogout.disable();
  unexpectedLogout.enable();
};

const logout = (user, reason) => {
  // (user: ContactSelf, reason?: string)
  global.requestor.id().then((id) => {
    global.requestor.log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.listener.wechat.logout',
      timestampMs: Date.now(),
      content: {
        name: user.name(), // string
        reason, // string
      },
    });
  });
  notLoginAfterStart.enable();
};

const ready = () => {
  global.requestor.id().then((id) => {
    global.requestor.log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.listener.wechat.ready',
      timestampMs: Date.now(),
      content: '{}',
    });
  });
};

/*
const roomInvite = (roomInvitation) => {
  // (roomInvitation: RoomInvitation)
  // TODO: bug - event connot be emitted.
};

const roomJoin = (room, inviteeList, inviter, date) => {
  // (room: Room, inviteeList: Contact[], inviter: Contact, date?: Date)
};

const roomLeave = (room, leaverList) => {
  // (room: Room, leaverList: Contact[],  remover?: Contact, date?: Date)
};

const roomTopic = (room, newTopic, oldTopic, changer, date) => {
  // (room: Room, newTopic: string, oldTopic: string, changer: Contact, date?: Date)
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
  global.requestor.id().then((id) => {
    global.requestor.log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.listener.wechat.scan',
      timestampMs: Date.now(),
      content: JSON.stringify({
        status: global.loginApproach.status, // string
        url: global.loginApproach.url, // string
        qrcode: global.loginApproach.qrcode, // string
        timestampMs: global.loginApproach.timestamp, // number as long
      }),
    });
  });
};

const start = () => {
  global.requestor.id().then((id) => {
    global.requestor.log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.listener.wechat.start',
      timestampMs: Date.now(),
      content: '{}',
    });
  });
};

const stop = () => {
  global.requestor.id().then((id) => {
    global.requestor.log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.listener.wechat.stop',
      timestampMs: Date.now(),
      content: '{}',
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
