import { log as wechatyLog } from 'wechaty';

import { global } from '../../utils/global';

const test = (validate, json) => {
  let payload;
  try {
    payload = JSON.parse(json);
    if (!validate(payload)) {
      throw {
        status: 400,
        payload: {
          reason: JSON.stringify(validate.errors),
          request: json,
        },
      };
    }
    if (payload.rpcToken !== global.setting.http.receiver.rpcToken) {
      throw {
        status: 403,
        payload: {
          reason: 'invalid rpc token',
          request: json,
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
          request: json,
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

const errorhandler = (type, validate, req, res) => {
  let data;
  if (typeof req.body === 'string') {
    data = test(validate, req.body);
  } else {
    data = {
      status: 400,
      payload: {
        reason: 'Header \'content-type\' should be \'application/json\'.',
        request: '',
      },
    };
  }
  if (data.status !== 200) {
    // local log
    wechatyLog.error(`local${type}`, JSON.stringify(data));
    console.log();
    // clean
    delete data.payload.request;
    // response
    res.status(data.status);
    res.set('content-type', 'application/json;charset=UTF-8');
    res.send(data.payload);
    // clean
    delete data.payload;
  }
  return data;
  // If `data.payload` is `200`, `data.payload` will be an object of parsed json from `req.body`.
  // Otherwise, `data.payload` will be `undefined` and `res` will be sent.
};

export { errorhandler };
