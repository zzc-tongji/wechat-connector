import { Wechaty, log as wechatyLog } from 'wechaty';

import * as http from './requestor/http';
import * as terminal from './requestor/terminal';
import { listen as httpListen } from './listener/http';
import * as wechat from './listener/wechat';
import * as cache from './utils/cache';
import { global } from './utils/global';
import * as notLoginAfterStart from './utils/report/not-login-after-start';
import * as unexpectedLogout from './utils/report/unexpected-logout';
import * as setting from './utils/setting';

import * as autoStart from './utils/auto-start';

const install = async () => {
  // local log
  wechatyLog.info('local.install', 'begin');
  console.log();
  const bot = new Wechaty();
  const exit = () => {
    // local log
    wechatyLog.info('local.install', 'end');
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
      if (autoStart.get()) {
        autoStart.set(false);
        global.start();
        global.requestor.id().then((id) => {
          global.requestor.log({
            id,
            instance: global.setting.wechaty.name,
            level: 'INFO',
            category: 'wechat-connector.auto-start',
            timestampMs: Date.now(),
            content: '{}',
          });
        });
      }
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
    global.requestor = http;
  } else { // 'terminal'
    global.requestor = terminal;
  }
  cache.init();
  unexpectedLogout.init();
  notLoginAfterStart.init();
  notLoginAfterStart.enable();
  global.logout = async () => {
    if (global.robot === null) {
      return;
    }
    global.loginApproach.url = null;
    global.loginApproach.qrcode = null;
    global.loginApproach.timestampMs = null;
    if (global.robot.logonoff()) {
      await global.robot.logout();
      unexpectedLogout.disable();
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
    global.loginApproach.timestampMs = null;
    await global.robot.stop();
    global.robot = null;
    unexpectedLogout.disable();
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
