import { log as wechatyLog } from 'wechaty';

const id = () => {
  return new Promise((resolve) => {
    resolve(Math.floor(Math.random() * -9007199254740991));
  });
};

const log = (content) => {
  // (content: object, fullText?: boolean)
  return new Promise((resolve) => {
    switch (content.level) {
      case 'error':
        delete content.level;
        wechatyLog.error(JSON.stringify(content));
        console.log();
        break;
      case 'warn':
        delete content.level;
        wechatyLog.warn(JSON.stringify(content));
        console.log();
        break;
      case 'verbose':
        delete content.level;
        wechatyLog.verbose(JSON.stringify(content));
        console.log();
        break;
      case 'silly':
        delete content.level;
        wechatyLog.silly(JSON.stringify(content));
        console.log();
        break;
      default: // 'info'
        delete content.level;
        wechatyLog.info(JSON.stringify(content));
        console.log();
        break;
    }
    resolve();
  });
};

export { id, log };
