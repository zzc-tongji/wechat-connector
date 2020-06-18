import fetch, { Headers } from 'node-fetch';
import { log as wechatyLog } from 'wechaty';

import { global } from '../utils/global';
import { getId as terminalGetId } from './terminal';

let headerPost;
let idUrl;
let logUrl;

const init = () => {
  headerPost = new Headers({ 'Content-Type': 'application/json' });
  const baseUrl = global.setting.http.sender.url.replace(/\/+$/, '');
  idUrl = baseUrl + '/id';
  logUrl = baseUrl + '/log';
};

const log = (content) => {
  // (content: object)
  return new Promise((resolve) => {
    const contentCopy = JSON.parse(JSON.stringify(content));
    contentCopy.token = global.setting.http.sender.token;
    // eslint-disable-next-line max-len
    fetch(logUrl, { method: 'POST', headerPost, body: JSON.stringify(contentCopy) }).then((response) => {
      if (!response.ok) {
        throw `fetch ${logUrl} => ${response.status}`;
      }
      resolve();
    }).catch((error) => {
      // eslint-disable-next-line max-len
      wechatyLog.warn(`${global.setting.wechaty.name}.requestor.http.log`, error);
      resolve();
    });
  });
};

const getId = () => {
  return new Promise((resolve) => {
    fetch(idUrl, { method: 'Get' }).then((response) => {
      if (!response.ok) {
        throw `fetch ${logUrl} => ${response.status}`;
      }
      response.json().then((data) => {
        if (!data.id) {
          throw `fetch ${idUrl} => id not found`;
        }
        resolve(data.id);
      });
    }).catch((error) => {
      // eslint-disable-next-line max-len
      wechatyLog.warn(`${global.setting.wechaty.name}.requestor.http.get-id`, error);
      terminalGetId().then((id) => {
        resolve(id);
      });
    });
  });
};

export { init, log, getId };
