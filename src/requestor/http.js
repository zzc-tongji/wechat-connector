import Ajv from 'ajv';
import fetch, { Headers } from 'node-fetch';
import { log as wechatyLog } from 'wechaty';

import { global } from '../utils/global';
import { getId as terminalGetId } from './terminal';

let headers;
let idUrl;
let idBody;

const init = () => {
  headers = new Headers({ 'Content-Type': 'application/json; charset=UTF-8' });
  idUrl = global.setting.http.sender.id.server.url;
  idBody = JSON.stringify({ token: global.setting.http.sender.id.server.token });
};

const log = (content) => {
  // (content: object)
  return new Promise((resolve) => {
    const contentCopy = JSON.parse(JSON.stringify(content));
    global.setting.http.sender.log.serverList.forEach((server) => {
      contentCopy.token = server.token;
      fetch(server.url, { method: 'POST', headers, body: JSON.stringify(contentCopy) }).then((response) => {
        if (!response.ok) {
          throw `fetch ${server.url} => ${response.status}`;
        }
        resolve();
      }).catch((error) => {
        // local log
        wechatyLog.warn('local.requestor.http.log', error);
        console.log();
        resolve();
      });
    });
  });
};

const getId = () => {
  return new Promise((resolve) => {
    fetch(idUrl, { method: 'POST', headers, body: idBody }).then((response) => {
      if (!response.ok) {
        throw `fetch ${idUrl} => ${response.status}`;
      }
      response.json().then((data) => {
        if (!validate(data)) {
          throw `fetch ${idUrl} => ${JSON.stringify(validate.errors)}`;
        }
        resolve(data.id);
      }).catch((e) => {
        x(e, resolve);
      });
    }).catch((error) => {
      x(error, resolve);
    });
  });
};

const validate = (new Ajv()).compile({
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'http://example.com/example.json',
  type: 'object',
  required: [
    'id',
  ],
  additionalProperties: false,
  properties: {
    id: {
      $id: '#/properties/id',
      type: 'integer',
    },
  },
});

const x = (error, resolve) => {
  // local log
  wechatyLog.warn('local.requestor.http.get-id', error);
  console.log();
  terminalGetId().then((id) => {
    resolve(id);
  });
};

export { init, log, getId };
