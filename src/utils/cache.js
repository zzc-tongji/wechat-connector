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

const removeExpired = async () => {
  const remove = [];
  cache.forEach((value, key) => {
    if (Date.now() - value.timestamp > expiration) {
      remove.push(key);
    }
  });
  remove.forEach((key) => {
    cache.delete(key);
  });
  global.requestor.log({
    id: await global.requestor.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.cache.remove-expired`,
    content: null,
    timestamp: Date.now(),
  });
};

const get = (key) => {
  const value = cache.get(key);
  global.requestor.getId().then((id) => {
    global.requestor.log({
      id,
      level: 'info',
      type: `${global.setting.wechaty.name}.cache.get`,
      content: { key, value },
      timestamp: Date.now(),
    });
  });
  return value;
};

const set = (key, value) => {
  if (!value.timestamp) {
    value.timestamp = Date.now();
  }
  cache.set(key, value);
  global.requestor.getId().then((id) => {
    global.requestor.log({
      id,
      level: 'info',
      type: `${global.setting.wechaty.name}.cache.set`,
      content: { key, value },
      timestamp: Date.now(),
    });
  });
};

export { init, get, set };
