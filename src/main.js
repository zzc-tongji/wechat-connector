import { Wechaty, log as localLog } from 'wechaty';

import * as http from './requestor/http';
import { listen as httpListen } from './listener/http';
import * as wechat from './listener/wechat';
import * as cache from './utils/cache';
import { global } from './utils/global';
import * as notLoginAfterStart from './utils/report/not-login-after-start';
import * as unexpectedLogout from './utils/report/unexpected-logout';
import * as setting from './utils/setting';

const install = () => {
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
  bot.start().catch(exit);
};

const normal = () => {
  // local log
  localLog.info('local.normal.begin');
  console.log();
  //
  setGlobal();
  run();
};

const setGlobal = () => {
  //
  setting.init(); // global.setting
  http.init();
  cache.init();
  unexpectedLogout.init();
  notLoginAfterStart.init();
  //
  notLoginAfterStart.enable();
  //
  global.logout = () => {
    if (global.robot === null) {
      return Promise.resolve();
    }
    global.loginApproach.status = '';
    global.loginApproach.url = '';
    global.loginApproach.qrcode = '';
    global.loginApproach.timestampMs = 0;
    if (global.robot.logonoff()) {
      return global.robot.logout().then(() => {
        unexpectedLogout.disable();
        return Promise.resolve();
      });
    }
    return Promise.resolve();
  };
  global.start = () => {
    if (global.robot !== null) {
      return Promise.resolve();
    }
    global.robot = new Wechaty(global.setting.wechaty);
    wechat.listen();
    return global.robot.start();
  };
  global.stop = () => {
    if (global.robot === null) {
      return Promise.resolve();
    }
    global.loginApproach.status = '';
    global.loginApproach.url = '';
    global.loginApproach.qrcode = '';
    global.loginApproach.timestampMs = 0;
    return global.robot.stop().then(() => {
      global.robot = null;
      unexpectedLogout.disable();
      return Promise.resolve();
    });
  };
  // Global variable `global.robot` will be set when executing function `start`.
};

const run = () => {
  // process
  const handleUncaughtException = (error) => {
    // local log
    localLog.error('local.uncaught-exception', `\n=> ${error.stack}`);
    console.log();
    // local log
    localLog.info('local.normal.exit');
    console.log();
    // exit
    process.exit(1);
  };
  const handleExit = (signal) => {
    global.stop().then(() => {
      // local log
      localLog.info('local.normal.exit', `\n=> ${signal}`);
      console.log();
      // exit
      process.exit(0);
    });
  };
  process.on('uncaughtException', handleUncaughtException);
  process.on('SIGTERM', handleExit);
  process.on('SIGINT', handleExit);
  // http listen
  httpListen();
  // wechaty start
  global.start();
};

// entry point

if (process.env.INSTALL) {
  install();
} else {
  normal();
}
