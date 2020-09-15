import { Wechaty, log as localLog } from 'wechaty';

import * as http from './requestor/http';
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
  localLog.info('local.install.begin');
  console.log();
  //
  const bot = new Wechaty();
  const exit = () => {
    // local log
    localLog.info('local.install.end');
    console.log();
    //
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
  process.on('uncaughtException', (error) => {
    // local log
    localLog.error('local.uncaught-exception', error.stack);
    console.log();
    //
    process.exit(1);
  });
  httpListen();
  if (autoStart.get()) {
    autoStart.set(false);
    global.start();
  }
};

const setGlobal = () => {
  setting.init(); // global.setting
  http.init();
  cache.init();
  unexpectedLogout.init();
  notLoginAfterStart.init();
  //
  notLoginAfterStart.enable();
  global.logout = async () => {
    if (global.robot === null) {
      return;
    }
    global.loginApproach.status = '';
    global.loginApproach.url = '';
    global.loginApproach.qrcode = '';
    global.loginApproach.timestampMs = 0;
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
    global.loginApproach.status = '';
    global.loginApproach.url = '';
    global.loginApproach.qrcode = '';
    global.loginApproach.timestampMs = 0;
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
