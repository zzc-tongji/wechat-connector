import { global } from '../global';
import { getStatus } from '../status';

let millisecond;
let maxCount;
let count;
let timer;

const init = () => {
  millisecond = Math.max(global.setting.report.notLoginAfterStart.timeSecond, global.setting.report.unexpectedLogout.timeSecond * (global.setting.report.unexpectedLogout.maxCount + 1)) * 1000;
  maxCount = global.setting.report.notLoginAfterStart.maxCount;
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
      level: 'WARN',
      category: 'wechat-worker.report.not-login-after-start',
      timestampMs: Date.now(),
      content: '{}',
    });
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
