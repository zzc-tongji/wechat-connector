import bodyParser from 'body-parser';
import express from 'express';
import { log as wechatyLog } from 'wechaty';

import { mock } from './http-mock';
import { validate as forwardValidate } from './http-validator/forward';
import { validate as replyValidate } from './http-validator/reply';
import { validate as sendValidate } from './http-validator/send';
import { validate as tokenValidate } from './http-validator/token';
import * as wechat from '../requestor/wechat';
import { global } from '../utils/global';

const app = express();

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
    if (payload.token !== global.setting.http.receiver.token) {
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

const errorhandler = (type, validate, req, res) => {
  const data = test(validate, req.body);
  if (data.status !== 200) {
    res.status(data.status);
    res.set('Content-Type', 'application/json; charset=UTF-8');
    res.send(data.payload);
    // local log
    wechatyLog.error(`local${type}`, data.payload);
    console.log();
  }
  return data;
};

// mock
mock(app);

// POST /rpc/exit
app.post('/rpc/exit', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = errorhandler('.listener.http.exit', tokenValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // response
  res.status(202);
  res.send();
});

// POST => /rpc/forward
app.post('/rpc/forward', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  // eslint-disable-next-line max-len
  const data = errorhandler('.listener.http.forward', forwardValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // forward
  delete data.payload.token;
  wechat.forward(data.payload);
  // response
  res.status(204);
  res.send();
});

// POST => /rpc/login-approach
// eslint-disable-next-line max-len
app.post('/rpc/login-approach', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  // eslint-disable-next-line max-len
  const data = errorhandler('.listener.http.login-approach', tokenValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // response
  res.set('Content-Type', 'application/json; charset=UTF-8');
  res.send(JSON.stringify({ loginApproach: global.loginApproach }));
});

// POST /rpc/logonoff
// eslint-disable-next-line max-len
app.post('/rpc/logonoff', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = errorhandler('.listener.http.logoff', tokenValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // response
  res.set('Content-Type', 'application/json; charset=UTF-8');
  // eslint-disable-next-line max-len
  res.send(JSON.stringify({ logonoff: global.robot ? global.robot.logonoff() : false }));
});

// POST => /rpc/logout
// eslint-disable-next-line max-len
app.post('/rpc/logout', bodyParser.text({ type: '*/*' }), async (req, res) => {
  // request
  const data = errorhandler('.listener.http.logout', tokenValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // logout
  await global.logout();
  // response
  res.status(204);
  res.send();
});

// POST => /rpc/reply
app.post('/rpc/reply', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = errorhandler('.listener.http.reply', replyValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // reply
  delete data.payload.token;
  wechat.reply(data.payload);
  // response
  res.status(204);
  res.send();
});

// POST => /rpc/send
app.post('/rpc/send', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = errorhandler('.listener.http.send', sendValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // send
  delete data.payload.token;
  wechat.send(data.payload);
  // response
  res.status(204);
  res.send();
});

// POST => /rpc/start
// eslint-disable-next-line max-len
app.post('/rpc/start', bodyParser.text({ type: '*/*' }), async (req, res) => {
  // request
  const data = errorhandler('.listener.http.start', tokenValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // start
  await global.start();
  // response
  res.status(204);
  res.send();
});

// POST => /rpc/stop
// eslint-disable-next-line max-len
app.post('/rpc/stop', bodyParser.text({ type: '*/*' }), async (req, res) => {
  // request
  const data = errorhandler('.listener.http.stop', tokenValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // stop
  await global.stop();
  // response
  res.status(204);
  res.send();
});

const listen = () => {
  app.listen(global.setting.http.receiver.port, () => {
    // log
    global.requestor.getId().then((id) => {
      global.requestor.log({
        instance: global.setting.wechaty.name,
        id,
        level: 'info',
        type: 'wechat-worker.listener.http.listen',
        timestamp: Date.now(),
        content: {
          port: global.setting.http.receiver.port, // number as integer
        },
      });
    });
  });
};

export { listen };
