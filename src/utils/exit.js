import * as fs from 'fs';
import { sep } from 'path';

import { global } from './global';

const directoryPath = `${__dirname}${sep}..${sep}..${sep}runtime-private${sep}`;
const exitScriptPath = `${directoryPath}docker-stop.sh`;

const generateExitScript = () => {
  const content = `#!/bin/sh\n\ncurl --silent --header "content-type:application/json;charset=UTF-8" --request POST --data '{"rpcToken":"${global.setting.http.receiver.rpcToken}"}' http://127.0.0.1:${global.setting.http.receiver.port}/rpc/exit\n`;
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  fs.writeFileSync(exitScriptPath, content, { encoding: 'utf-8', flag: 'w' });
  fs.chmodSync(exitScriptPath, 0o755);
};

export { generateExitScript };
