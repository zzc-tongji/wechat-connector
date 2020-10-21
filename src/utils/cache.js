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
    if (Date.now() - value.timestampMs > expiration) {
      remove.push(key);
    }
  });
  remove.forEach((key) => {
    cache.delete(key);
  });
};

const get = (key) => {
  if (expiration <= 0) {
    return undefined;
  }
  const value = cache.get(key);
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
};

export { init, get, set };
