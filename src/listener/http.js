import bodyParser from 'body-parser';
import express from 'express';

import { mock } from './utils/http-mock';
import { validate as forwardValidate } from './utils/http-validator/forward';
import { validate as replyValidate } from './utils/http-validator/reply';
import { validate as sendValidate } from './utils/http-validator/send';
import { validate as tokenValidate } from './utils/http-validator/token';
import { errorhandler } from './utils/http-error-handler';
import * as wechat from '../requestor/wechat';
import { global } from '../utils/global';

const app = express();

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
app.post('/rpc/login-approach', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = errorhandler('.listener.http.login-approach', tokenValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // response
  res.set('Content-Type', 'application/json; charset=UTF-8');
  res.send(JSON.stringify({ loginApproach: global.loginApproach }));
});

// POST /rpc/status
app.post('/rpc/status', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = errorhandler('.listener.http.status', tokenValidate, req, res);
  if (data.status !== 200) {
    return;
  }
  // response
  res.set('Content-Type', 'application/json; charset=UTF-8');
  res.send(JSON.stringify({ status: global.robot ? (global.robot.logonoff() ? 'logged-in' : 'logged-out') : 'stopped' }));
});

// POST => /rpc/logout
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
