import { ScanStatus, Friendship } from 'wechaty';

import * as notLoginAfterStart from '../utils/report/not-login-after-start';
import * as unexpectedLogout from '../utils/report/unexpected-logout';
import * as cache from '../utils/cache';
import { global } from '../utils/global';
import { message } from './wechat-utils/message';
import { id, log } from '../requestor/http';
import { sync } from '../requestor/wechat';

const error = (error) => {
  // (error: Error)
  //
  // id
  id().then((id) => {
    // log
    log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-connector.listener.wechat.error',
      timestampMs: Date.now(),
      content: JSON.stringify({
        name: typeof error.name === 'string' ? error.name : '', // string
        message: typeof error.message === 'string' ? error.message : '', // string
        stack: typeof error.stack === 'string' ? error.stack : '', // string
      }),
    }).then(() => {
      global.stop().then(() => {
        process.exit(1);
      });
    });
  });
};

const friendship = (f) => {
  // (f: Friendship)
  //
  // id
  id().then((id) => {
    // CACHE
    cache.set(id, { friendship: f, contact: f.contact() });
    // log
    log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-connector.listener.wechat.friendship',
      timestampMs: Date.now(),
      content: JSON.stringify({
        friendshipType: Friendship.Type[f.type()],
        requestMessage: f.hello(),
        requesterName: f.contact().name(),
      }),
    });
  });
};

const login = (user) => {
  // (user: ContactSelf)
  //
  // prepare for report
  notLoginAfterStart.disable();
  unexpectedLogout.disable();
  unexpectedLogout.enable();
  // id
  id().then((id) => {
    // log
    log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-connector.listener.wechat.login',
      timestampMs: Date.now(),
      content: '{}',
    });
  });
};

const logout = (user, reason) => {
  // (user: ContactSelf, reason?: string)
  //
  // prepare for report
  notLoginAfterStart.enable();
  // id
  id().then((id) => {
    // log
    log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-connector.listener.wechat.logout',
      timestampMs: Date.now(),
      content: '{}',
    });
  });
};

const ready = () => {
  // id
  id().then((id) => {
    // log
    log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-connector.listener.wechat.ready',
      timestampMs: Date.now(),
      content: '{}',
    });
  });
};


const roomInvite = (roomInvitation) => {
  // (roomInvitation: RoomInvitation)
  roomInvitation.topic().then((t) => {
    id().then((id) => {
      // CACHE
      cache.set(id, { roomInvitation });
      // log
      log({
        id,
        instance: global.setting.wechaty.name,
        level: 'INFO',
        category: 'wechat-connector.listener.wechat.room-invite',
        timestampMs: Date.now(),
        content: JSON.stringify({
          groupName: t,
        }),
      });
    });
  });
};

const roomJoin = (room, inviteeList, inviter, date) => {
  // (room: Room, inviteeList: Contact[], inviter: Contact, date?: Date)
  //
  // update
  sync(room);
  //
  room.topic().then((t) => {
    id().then((id) => {
      // log
      log({
        id,
        instance: global.setting.wechaty.name,
        level: 'INFO',
        category: 'wechat-connector.listener.wechat.room-join',
        timestampMs: Date.now(),
        content: JSON.stringify({
          groupName: t,
        }),
      });
    });
  });
};

const roomLeave = (room, leaverList, remover, date) => {
  // (room: Room, leaverList: Contact[],  remover?: Contact, date?: Date)
  room.topic().then((t) => {
    id().then((id) => {
      // log
      log({
        id,
        instance: global.setting.wechaty.name,
        level: 'INFO',
        category: 'wechat-connector.listener.wechat.room-leave',
        timestampMs: Date.now(),
        content: JSON.stringify({
          groupName: t,
        }),
      });
    });
  });
};

const roomTopic = (room, newTopic, oldTopic, changer, date) => {
  // (room: Room, newTopic: string, oldTopic: string, changer: Contact, date?: Date)
  //
  // update
  sync(room);
  //
  id().then((id) => {
    // log
    log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-connector.listener.wechat.room-topic',
      timestampMs: Date.now(),
      content: JSON.stringify({
        oldGroupName: typeof oldTopic === 'string' ? oldTopic : '',
        newGropuName: typeof newTopic === 'string' ? newTopic : '',
      }),
    });
  });
};

const scan = (qrcode, status) => {
  // (qrcode: string, status: ScanStatus, data?: string)
  global.loginApproach.status = ScanStatus[status];
  global.loginApproach.url = qrcode;
  global.loginApproach.qrcode = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');
  global.loginApproach.timestampMs = Date.now();
};

const start = () => {
  id().then((id) => {
    // log
    log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-connector.listener.wechat.start',
      timestampMs: Date.now(),
      content: '{}',
    });
  });
};

const stop = () => {
  id().then((id) => {
    // log
    log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-connector.listener.wechat.stop',
      timestampMs: Date.now(),
      content: '{}',
    });
  });
};

const listen = () => {
  // event
  global.robot.on('error', error);
  global.robot.on('friendship', friendship);
  global.robot.on('login', login);
  global.robot.on('logout', logout);
  global.robot.on('message', message);
  global.robot.on('ready', ready);
  global.robot.on('room-invite', roomInvite);
  global.robot.on('room-join', roomJoin);
  global.robot.on('room-leave', roomLeave);
  global.robot.on('room-topic', roomTopic);
  global.robot.on('scan', scan);
  global.robot.on('start', start);
  global.robot.on('stop', stop);
};

export { listen };
