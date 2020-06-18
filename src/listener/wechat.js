import { ScanStatus } from 'wechaty';

import { global } from '../utils/global';
import * as cache from '../utils/cache';

const dong = async (data) => {
  // (data?: string)
  global.requestor.log({
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.wechat.dong`,
    content: { data },
    timestamp: Date.now(),
  });
};

const error = async (error) => {
  // (error: Error)
  global.requestor.log({
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.wechat.error`,
    content: { error },
    timestamp: Date.now(),
  });
};

// eslint-disable-next-line no-unused-vars
const friendship = (friendship) => {
  // (friendship: Friendship)
};

const heatbeat = async (data) => {
  // (data: any)
  global.requestor.log({
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.wechat.heatbeat`,
    content: { data },
    timestamp: Date.now(),
  });
};

const login = async (user) => {
  // (user: ContactSelf)
  global.requestor.log({
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.wechat.login`,
    content: { user },
    timestamp: Date.now(),
  });
};

const logout = async (user, reason) => {
  // (user: ContactSelf, reason?: string)
  global.requestor.log({
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.wechat.logout`,
    content: { user, reason },
    timestamp: Date.now(),
  });
};

const message = async (m) => {
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
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.wechat.message`,
    content,
    timestamp: Date.now(),
  };
  await global.requestor.log(payload);
  // cache
  cache.set(payload.id, payload);
};

const ready = async () => {
  global.requestor.log({
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.wechat.ready`,
    content: null,
    timestamp: Date.now(),
  });
};

// eslint-disable-next-line no-unused-vars
const roomInvite = (roomInvitation) => {
  // (roomInvitation: RoomInvitation)
  //
  // TODO: bug - event connot be emitted.
};

// eslint-disable-next-line no-unused-vars
const roomJoin = (room, inviteeList, inviter, date) => {
  // (room: Room, inviteeList: Contact[], inviter: Contact, date?: Date)
};

// eslint-disable-next-line no-unused-vars
const roomLeave = (room, leaverList) => {
  // (room: Room, leaverList: Contact[],  remover?: Contact, date?: Date)
};

// eslint-disable-next-line no-unused-vars
const roomTopic = (room, newTopic, oldTopic, changer, date) => {
  // eslint-disable-next-line max-len
  // (room: Room, newTopic: string, oldTopic: string, changer: Contact, date?: Date)
};

const scan = async (qrcode, status) => {
  // (qrcode: string, status: ScanStatus, data?: string)
  global.loginApproach.url = qrcode;
  global.loginApproach.qrcode = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');
  global.loginApproach.timestamp = Date.now();
  //
  global.requestor.log({
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.wechat.scan`,
    content: { qrcode, status: ScanStatus[status] },
    data: global.loginApproach,
    timestamp: Date.now(),
  });
};

const start = async () => {
  global.requestor.log({
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.wechat.start`,
    content: null,
    timestamp: Date.now(),
  });
};

const stop = async () => {
  global.requestor.log({
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.wechat.stop`,
    content: null,
    timestamp: Date.now(),
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
