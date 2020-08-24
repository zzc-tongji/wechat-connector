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
        },
      };
    }
    if (payload.rpcToken !== global.setting.http.receiver.rpcToken) {
      throw {
        status: 403,
        payload: {
          reason: 'invalid rpc token',
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

const errorhandler = (type, validate, req, res) => {
  let data;
  if (typeof (req.body) === 'string') {
    data = test(validate, req.body);
  } else {
    data = {
      status: 400,
      payload: {
        reason: 'Header \'content-type\' should be \'application/json\'.',
      },
    };
  }
  if (data.status !== 200) {
    res.status(data.status);
    res.set('content-type', 'application/json;charset=UTF-8');
    res.send(data.payload);
    // local log
    wechatyLog.error(`local${type}`, JSON.stringify(data.payload));
    console.log();
  }
  return data;
};

export { errorhandler };
