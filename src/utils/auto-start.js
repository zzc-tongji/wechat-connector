import * as fs from 'fs';
import { sep } from 'path';

const tagPath = `${__dirname}${sep}..${sep}..${sep}runtime${sep}auto-start.tag`;

const get = () => {
  return fs.existsSync(tagPath);
};

const set = (enable) => {
  if (enable && !fs.existsSync(tagPath)) {
    fs.writeFileSync(tagPath, '');
  }
  if (!enable && fs.existsSync(tagPath)) {
    fs.unlinkSync(tagPath);
  }
};

export { get, set };
