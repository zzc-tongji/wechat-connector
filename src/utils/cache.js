import Hashmap from 'hashmap';

import { id, log } from '../requestor/http';
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
    if (Date.now() - value.timestampMs > expiration) {
      remove.push(key);
    }
  });
  remove.forEach((key) => {
    cache.delete(key);
  });
  if (global.setting.cache.enableLog) {
    id().then((id) => {
      log({
        id,
        instance: global.setting.wechaty.name,
        level: 'INFO',
        category: 'wechat-connector.cache.remove-expired',
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
    id().then((id) => {
      log({
        id,
        instance: global.setting.wechaty.name,
        level: 'INFO',
        category: 'wechat-connector.cache.get',
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
  if (!value.timestampMs) {
    value.timestampMs = Date.now();
  }
  cache.set(key, value);
  if (global.setting.cache.enableLog) {
    id().then((id) => {
      log({
        id,
        instance: global.setting.wechaty.name,
        level: 'INFO',
        category: 'wechat-connector.cache.set',
        timestampMs: Date.now(),
        content: JSON.stringify({
          key, // number as long
        }),
      });
    });
  }
};

export { init, get, set };
