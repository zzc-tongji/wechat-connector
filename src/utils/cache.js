import Hashmap from 'hashmap';

import { global } from './global';

let cache;
let expiration;
let timer;

const init = () => {
  cache = new Hashmap();
  expiration = global.setting.cache.expirationSecond * 1000;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  timer = setInterval(removeExpired, expiration);
};

const removeExpired = () => {
  if (expiration <= 0) {
    return;
  }
  const remove = [];
  cache.forEach((value, key) => {
    if (Date.now() - value.timestamp > expiration) {
      remove.push(key);
    }
  });
  remove.forEach((key) => {
    cache.delete(key);
  });
  if (global.setting.cache.enableLog) {
    global.requestor.id().then((id) => {
      global.requestor.log({
        id,
        instance: global.setting.wechaty.name,
        level: 'INFO',
        category: 'wechat-worker.cache.remove-expired',
        timestampMs: Date.now(),
        content: '{}',
      });
    });
  }
};

const get = (key) => {
  if (expiration <= 0) {
    return undefined;
  }
  const value = cache.get(key);
  if (global.setting.cache.enableLog) {
    global.requestor.id().then((id) => {
      global.requestor.log({
        id,
        instance: global.setting.wechaty.name,
        level: 'INFO',
        category: 'wechat-worker.cache.get',
        timestampMs: Date.now(),
        content: JSON.stringify({
          key, // number as long
          success: value ? true : false, // boolean
        }),
      });
    });
  }
  return value;
};

const set = (key, value) => {
  if (expiration <= 0) {
    return;
  }
  if (!value.timestamp) {
    value.timestamp = Date.now();
  }
  cache.set(key, value);
  if (global.setting.cache.enableLog) {
    global.requestor.id().then((id) => {
      global.requestor.log({
        id,
        instance: global.setting.wechaty.name,
        level: 'INFO',
        category: 'wechat-worker.cache.set',
        timestampMs: Date.now(),
        content: JSON.stringify({
          key, // number as long
        }),
      });
    });
  }
};

export { init, get, set };
