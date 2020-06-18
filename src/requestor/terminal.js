import { log as wechatyLog } from 'wechaty';

const log = (payload) => {
  // (payloadCopy: object, fullText?: boolean)
  return new Promise((resolve) => {
    const payloadCopy = JSON.parse(JSON.stringify(payload));
    switch (payloadCopy.level) {
      case 'error':
        delete payloadCopy.level;
        wechatyLog.error(JSON.stringify(payloadCopy));
        console.log();
        break;
      case 'warn':
        delete payloadCopy.level;
        wechatyLog.warn(JSON.stringify(payloadCopy));
        console.log();
        break;
      case 'verbose':
        delete payloadCopy.level;
        wechatyLog.verbose(JSON.stringify(payloadCopy));
        console.log();
        break;
      case 'silly':
        delete payloadCopy.level;
        wechatyLog.silly(JSON.stringify(payloadCopy));
        console.log();
        break;
      default: // 'info'
        delete payloadCopy.level;
        wechatyLog.info(JSON.stringify(payloadCopy));
        console.log();
        break;
    }
    resolve();
  });
};

const getId = () => {
  return new Promise((resolve) => {
    resolve(Math.floor(Math.random() * -9007199254740991));
  });
};

export { log, getId };
