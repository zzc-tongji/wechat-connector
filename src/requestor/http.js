import Ajv from 'ajv';
import fetch, { Headers } from 'node-fetch';
import { log as wechatyLog } from 'wechaty';

import { global } from '../utils/global';

let headers;
let idUrl;

const init = () => {
  headers = new Headers([['content-type', 'application/json;charset=UTF-8']]);
  idUrl = global.setting.http.sender.id;
};

const id = () => {
  return new Promise((resolve) => {
    fetch(idUrl).then((response) => {
      if (!response.ok) {
        throw `fetch ${idUrl} => ${response.status}`;
      }
      response.json().then((data) => {
        if (!validate(data)) {
          throw `fetch ${idUrl} => ${JSON.stringify(validate.errors)}`;
        }
        resolve(data.id);
      }).catch((e) => {
        idHelper(e, resolve);
      });
    }).catch((error) => {
      idHelper(error, resolve);
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

const idHelper = (error, resolve) => {
  // local log
  wechatyLog.error('local.requestor.http.id.error', typeof error == 'string' ? error : error.message);
  console.log();
  //
  resolve(Math.floor(-1 + Math.random() * -9007199254740991));
};

const log = (content) => {
  // (content: object)
  const promiseList = [];
  global.setting.http.sender.log.forEach((server) => {
    content.rpcToken = server.rpcToken;
    promiseList.push(new Promise((resolve) => {
      fetch(server.url, { method: 'POST', headers, body: JSON.stringify(content) }).then((response) => {
        if (response.ok) {
          resolve();
          return;
        }
        response.text().then((text) => {
          throw `fetch ${server.url} => ${response.status} => ${text}`;
        }).catch((error) => {
          logHelper(error, resolve);
        });
      }).catch((error) => {
        logHelper(error, resolve);
      });
    }));
  });
  return Promise.all(promiseList);
};

const logHelper = (error, resolve) => {
  // local log
  wechatyLog.error('local.requestor.http.log.error', typeof error == 'string' ? error : error.message);
  console.log();
  //
  resolve();
};

export { init, id, log };
