import { global } from '../../utils/global';

const test = (validate, json) => {
  let payload;
  try {
    payload = JSON.parse(json);
  } catch (error) {
    return {
      status: 400,
      payload: {
        reason: error.message,
        request: json,
      },
    };
  }
  if (!validate(payload)) {
    return {
      status: 400,
      payload: {
        reason: JSON.stringify(validate.errors),
        request: json,
      },
    };
  }
  if (payload.rpcToken !== global.setting.http.receiver.rpcToken) {
    return {
      status: 403,
      payload: {
        reason: 'invalid rpc token',
        request: json,
      },
    };
  }
  return {
    status: 200,
    payload,
  };
};

const errorhandler = (validate, req, res) => {
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
    // clean
    delete data.payload.request;
    // response
    res.status(data.status);
    res.set('content-type', 'application/json;charset=UTF-8');
    res.send(data.payload);
    return null;
  }
  return data.payload;
  // The return value is a validated payload object.
  // If not validated, `res` will be sent and `null` will be returned.
};

export { errorhandler };
