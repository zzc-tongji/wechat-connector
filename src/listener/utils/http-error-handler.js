import { log as wechatyLog } from 'wechaty';

import { global } from '../../utils/global';

const test = (validate, json, mock = false) => {
  let payload;
  try {
    payload = JSON.parse(json);
    if (!validate(payload)) {
      throw {
        status: 400,
        payload: {
          reason: JSON.stringify(validate.errors),
        },
      };
    }
    if (!mock && payload.token !== global.setting.http.receiver.token) {
      throw {
        status: 403,
        payload: {
          reason: 'invalid token',
        },
      };
    }
  } catch (error) {
    if (!error.status) {
      // 'SyntaxError: JSON.parse: ...'
      return {
        status: 400,
        payload: {
          reason: error.toString(),
        },
      };
    }
    return error;
  }
  return {
    status: 200,
    payload,
  };
};

const errorhandler = (type, validate, req, res, mock = false) => {
  const data = test(validate, req.body, mock);
  if (data.status !== 200) {
    res.status(data.status);
    res.set('Content-Type', 'application/json; charset=UTF-8');
    res.send(data.payload);
    // local log
    wechatyLog.error(`local${type}`, JSON.stringify(data.payload));
    console.log();
  }
  return data;
};

export { errorhandler };
