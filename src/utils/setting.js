import * as fs from 'fs';
import { sep } from 'path';

import Ajv from 'ajv';
import { log as wechatyLog } from 'wechaty';

import { global } from './global';

const validate = (new Ajv()).compile({
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: '',
  type: 'object',
  required: [
    'wechaty',
    'cache',
    'report',
    'mode',
  ],
  additionalProperties: true,
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
        },
      },
    },
    cache: {
      $id: '#/properties/cache',
      type: 'object',
      required: [
        'expirationSecond',
        'enableLog',
      ],
      additionalProperties: false,
      properties: {
        expirationSecond: {
          $id: '#/properties/cache/properties/expirationSecond',
          type: 'integer',
          minimum: 0,
        },
        enableLog: {
          $id: '#/properties/cache/properties/enableLog',
          type: 'boolean',
        },
      },
    },
    report: {
      $id: '#/properties/report',
      type: 'object',
      required: [
        'notLoginAfterStart',
        'unexpectedLogout',
      ],
      additionalProperties: true,
      properties: {
        notLoginAfterStart: {
          $id: '#/properties/report/properties/notLoginAfterStart',
          type: 'object',
          required: [
            'timeSecond',
            'maxCount',
          ],
          additionalProperties: true,
          properties: {
            timeSecond: {
              $id: '#/properties/report/properties/notLoginAfterStart/properties/timeSecond',
              type: 'integer',
              minimum: 600,
            },
            maxCount: {
              $id: '#/properties/report/properties/notLoginAfterStart/properties/maxCount',
              type: 'integer',
              minimum: 1,
            },
          },
        },
        unexpectedLogout: {
          $id: '#/properties/report/properties/unexpectedLogout',
          type: 'object',
          required: [
            'timeSecond',
            'maxCount',
          ],
          additionalProperties: true,
          properties: {
            timeSecond: {
              $id: '#/properties/report/properties/unexpectedLogout/properties/timeSecond',
              type: 'integer',
              minimum: 60,
            },
            maxCount: {
              $id: '#/properties/report/properties/unexpectedLogout/properties/maxCount',
              $ref: '#/properties/report/properties/notLoginAfterStart/properties/maxCount',
            },
          },
        },
      },
    },
    mode: {
      $id: '#/properties/mode',
      type: 'string',
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
              minimum: 1024,
            },
            token: {
              $id: '#/properties/http/properties/receiver/properties/token',
              type: 'string',
            },
          },
        },
        sender: {
          $id: '#/properties/http/properties/sender',
          type: 'object',
          required: [
            'id',
            'log',
          ],
          additionalProperties: false,
          properties: {
            id: {
              $id: '#/properties/http/properties/sender/properties/id',
              type: 'object',
              required: [
                'server',
              ],
              additionalProperties: false,
              properties: {
                server: {
                  $id: '#/properties/http/properties/sender/properties/id/properties/server',
                  type: 'object',
                  required: [
                    'url',
                    'token',
                  ],
                  additionalProperties: false,
                  properties: {
                    url: {
                      $id: '#/properties/http/properties/sender/properties/id/properties/server/properties/url',
                    },
                    token: {
                      $id: '#/properties/http/properties/sender/properties/id/properties/server/properties/token',
                      type: 'string',
                    },
                  },
                },
              },
            },
            log: {
              $id: '#/properties/http/properties/sender/properties/log',
              type: 'object',
              required: [
                'serverList',
              ],
              additionalProperties: false,
              properties: {
                serverList: {
                  $id: '#/properties/http/properties/sender/properties/log/properties/serverList',
                  type: 'array',
                  additionalItems: false,
                  items: {
                    $ref: '#/properties/http/properties/sender/properties/id/properties/server',
                  },
                },
              },
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
      settingPath = `${__dirname}${sep}..${sep}..${sep}runtime${sep}setting.json`;
    }
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
    // local log
    wechatyLog.error('local.setting', error);
    console.log();
    process.exit(1);
  }
};

export { init };
