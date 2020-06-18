import { Wechaty, log as wechatyLog } from 'wechaty';

import * as http from './requestor/http';
import * as terminal from './requestor/terminal';
import { listen as httpListen } from './listener/http';
import * as wechat from './listener/wechat';
import * as cache from './utils/cache';
import { global } from './utils/global';
import * as setting from './utils/setting';

const install = async () => {
  wechatyLog.info('wechat-worker.install', 'begin');
  console.log();
  const bot = new Wechaty();
  const exit = () => {
    wechatyLog.info('wechat-worker.install', 'end');
    console.log();
    process.exit(0);
  };
  bot.on('start', exit);
  try {
    await bot.start();
  } catch (error) {
    exit();
  }
};

const run = () => {
  switch (global.setting.mode) {
    case 'http':
      httpListen();
      break;
    default: // 'terminal'
      global.start();
      break;
  }
};

const setGlobal = () => {
  setting.init(); // global.setting
  if (global.setting.mode === 'http') {
    http.init();
    global.log = http.log;
    global.getId = http.getId;
  } else { // 'terminal'
    global.log = terminal.log;
    global.getId = terminal.getId;
  }
  cache.init();
  global.logout = async () => {
    if (global.robot === null) {
      return;
    }
    global.loginApproach.url = null;
    global.loginApproach.qrcode = null;
    global.loginApproach.timestamp = null;
    if (global.robot.logonoff()) {
      await global.robot.logout();
    }
  };
  global.start = async () => {
    if (global.robot !== null) {
      return;
    }
    global.robot = new Wechaty(global.setting.wechaty);
    wechat.listen();
    await global.robot.start();
  };
  global.stop = async () => {
    if (global.robot === null) {
      return;
    }
    global.loginApproach.url = null;
    global.loginApproach.qrcode = null;
    global.loginApproach.timestamp = null;
    await global.robot.stop();
    global.robot = null;
  };
  // Global variable `global.robot` will be set when executing function `start`.
};

// entry point

if (process.env.INSTALL) {
  install();
} else {
  setGlobal();
  run();
}
