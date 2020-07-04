import { global } from '../global';
import { getStatus } from '../status';

let millisecond;
let maxCount;
let count;
let timer;

const init = () => {
  millisecond = global.setting.report.unexpectedLogout.timeSecond * 1000;
  maxCount = global.setting.report.unexpectedLogout.maxCount;
  count = 0;
  timer = null;
};

const enable = () => {
  if (timer) {
    return;
  }
  timer = setInterval(f, millisecond);
};

const f = () => {
  if (getStatus() === 'logged-in') {
    return;
  }
  global.requestor.id().then((id) => {
    global.requestor.log({
      id,
      instance: global.setting.wechaty.name,
      level: 'error',
      category: 'wechat-worker.report.unexpected-logout',
      timestamp: Date.now(),
      content: '{}',
    });
  });
  global.requestor.report({
    instance: global.setting.wechaty.name,
    category: 'wechat-worker.report.unexpected-logout',
  });
  count += 1;
  if (count >= maxCount) {
    disable();
  }
};

const disable = () => {
  if (!timer) {
    return;
  }
  clearInterval(timer);
  timer = null;
  count = 0;
};

export { init, enable, disable };
