import * as fs from 'fs';
import { sep } from 'path';

import Ajv from 'ajv';
import { log as wechatyLog } from 'wechaty';

import { global } from './global';

const validate = (new Ajv()).compile({
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: '',
  type: 'object',
  additionalProperties: false,
  required: [
    'wechaty',
    'cache',
    'mode',
  ],
  properties: {
    wechaty: {
      $id: '#/properties/wechaty',
      type: 'object',
      required: [
        'name',
      ],
      additionalProperties: false,
      properties: {
        name: {
          $id: '#/properties/wechaty/properties/name',
          type: 'string',
          minLength: 1,
        },
      },
    },
    cache: {
      $id: '#/properties/cache',
      type: 'object',
      required: [
        'expirationSecond',
      ],
      additionalProperties: false,
      properties: {
        expirationSecond: {
          $id: '#/properties/cache/properties/expirationSecond',
          type: 'integer',
          maximum: 1800,
          minimun: 60,
        },
      },
    },
    mode: {
      $id: '#/properties/mode',
      type: 'string',
      enum: [
        'http',
        'terminal',
      ],
    },
    http: {
      $id: '#/properties/http',
      type: 'object',
      required: [
        'receiver',
        'sender',
      ],
      additionalProperties: false,
      properties: {
        receiver: {
          $id: '#/properties/http/properties/receiver',
          type: 'object',
          required: [
            'port',
            'token',
          ],
          additionalProperties: false,
          properties: {
            port: {
              $id: '#/properties/http/properties/receiver/properties/port',
              type: 'integer',
              maximum: 65535,
              minimun: 1024,
            },
            token: {
              $id: '#/properties/http/properties/receiver/properties/token',
              type: 'string',
              maxlength: 64,
              minLength: 1,
            },
          },
        },
        sender: {
          $id: '#/properties/http/properties/sender',
          type: 'object',
          required: [
            'url',
            'token',
          ],
          additionalProperties: false,
          properties: {
            url: {
              $id: '#/properties/http/properties/sender/properties/url',
              type: 'string',
            },
            token: {
              $id: '#/properties/http/properties/sender/properties/token',
              type: 'string',
              maxlength: 64,
              minLength: 1,
            },
          },
        },
      },
    },
  },
});

const init = (settingPath = null) => {
  try {
    if (typeof settingPath !== 'string') {
      // eslint-disable-next-line max-len
      settingPath = `${__dirname}${sep}..${sep}..${sep}runtime${sep}setting.json`;
    }
    // eslint-disable-next-line max-len
    const settingText = fs.readFileSync(settingPath, { encoding: 'utf-8', flag: 'r' });
    const setting = JSON.parse(settingText);
    if (!validate(setting)) {
      throw JSON.stringify(validate.errors);
    }
    switch (setting.mode) {
      case 'http':
        if (!setting.http) {
          throw 'setting.http => not found';
        }
        break;
      default:
        break;
    }
    global.setting = setting;
  } catch (error) {
    wechatyLog.error('wechat-worker.setting', error);
    process.exit(1);
  }
};

export { init };
