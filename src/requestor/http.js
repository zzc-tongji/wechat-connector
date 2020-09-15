import Ajv from 'ajv';
import fetch, { Headers } from 'node-fetch';
import { log as localLog } from 'wechaty';

import { global } from '../utils/global';

let headers;
let idUrl;

const init = () => {
  headers = new Headers([['content-type', 'application/json;charset=UTF-8']]);
  idUrl = global.setting.http.sender.id;
};

const id = () => {
  // () => Promise <number as integer>
  let responseStatus;
  let responseBody;
  return fetch(idUrl).then((response) => {
    responseStatus = response.status;
    if (!response.ok) {
      throw new Error(`response status: ${responseStatus}`);
    }
    return response.text();
  }).then((text) => {
    responseBody = text;
    let data;
    try {
      data = JSON.parse(responseBody);
    } catch (error) {
      throw new Error(`response status: ${responseStatus} => response body: ${responseBody} => JSON error: ${error.message}`);
    }
    return Promise.resolve(data);
  }).then((data) => {
    if (!validate(data)) {
      throw new Error(`response status: ${responseStatus} => response body: ${responseBody} => schema error: ${JSON.stringify(validate.errors)}`);
    }
    return Promise.resolve(data.id);
  }).catch((error) => {
    // local log
    localLog.warn('local.requestor.http.id.failure', `\n=> GET ${idUrl}\n=> ${error.message}`);
    console.log();
    // Use local ID of negative integer instead.
    return Promise.resolve(Math.floor(-1 + Math.random() * -9007199254740991));
  });
};

const validate = (new Ajv({ allErrors: true })).compile({
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

const log = (content) => {
  // (content: object) => Promise <void>
  const promiseList = [];
  global.setting.http.sender.log.forEach((server) => {
    content.rpcToken = server.rpcToken;
    promiseList.push(new Promise((resolve) => {
      const body = JSON.stringify(content);
      let responseStatus;
      fetch(server.url, { method: 'POST', headers, body }).then((response) => {
        if (response.ok) {
          resolve();
          return Promise.resolve(null);
        }
        responseStatus = response.status;
        return response.text();
      }).then((text) => {
        if (typeof text === 'string') {
          throw new Error(`request body: ${body}\n=> response status: ${responseStatus}\n=> response body: ${text}`);
        }
      }).catch((error) => {
        // local log
        localLog.warn('local.requestor.http.log.failure', `\n=> POST ${server.url}\n=> ${error.message}`);
        console.log();
        //
        resolve();
      });
    }));
  });
  return Promise.all(promiseList);
};

export { init, id, log };
