import bodyParser from 'body-parser';
import express from 'express';
import { log as wechatyLog } from 'wechaty';

import { test as forwardTest } from './http-validator/forward';
import { test as replyTest } from './http-validator/reply';
import { test as sendTest } from './http-validator/send';
import { test as tokenTest } from './http-validator/token';
import * as wechat from '../requestor/wechat';
import { global } from '../utils/global';

const app = express();

// POST /rpc/exit
app.post('/rpc/exit', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = tokenTest(req.body, global.setting.http.receiver.token);
  if (data.status >= 300) {
    res.status(data.status);
    res.send();
    // eslint-disable-next-line max-len
    wechatyLog.error(`${global.setting.wechaty.name}.listener.http.exit`, data.payload);
    return;
  }
  // response
  res.status(202);
  res.send();
  // log
  global.getId().then((id) => {
    global.log({
      id,
      level: 'info',
      type: `${global.setting.wechaty.name}.listener.http.exit`,
      content: null,
      timestamp: Date.now(),
    }).then(() => {
      process.exit(0);
    });
  });
});

// POST => /rpc/forward
app.post('/rpc/forward', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = forwardTest(req.body, global.setting.http.receiver.token);
  if (data.status >= 300) {
    res.status(data.status);
    res.send();
    // eslint-disable-next-line max-len
    wechatyLog.error(`${global.setting.wechaty.name}.listener.http.forward`, data.payload);
    return;
  }
  // forward
  delete data.payload.token;
  wechat.forward(data.payload);
  // response
  res.status(204);
  res.send();
  // log
  global.getId().then((id) => {
    global.log({
      id,
      level: 'info',
      type: `${global.setting.wechaty.name}.listener.http.forward`,
      content: null,
      timestamp: Date.now(),
    });
  });
});

// POST => /rpc/log
app.post('/rpc/log', bodyParser.text({ type: '*/*' }), (req, res) => {
  // test usage
  //
  // request
  const request = JSON.parse(req.body);
  // echo
  wechatyLog.info('[ECHO]', JSON.stringify(request));
  // response
  res.status(202);
  res.send();
});

// POST => /rpc/login-approach
// eslint-disable-next-line max-len
app.post('/rpc/login-approach', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = tokenTest(req.body, global.setting.http.receiver.token);
  if (data.status >= 300) {
    res.status(data.status);
    res.send();
    // eslint-disable-next-line max-len
    wechatyLog.error(`${global.setting.wechaty.name}.listener.http.login-approach`, data.payload);
    return;
  }
  // response
  res.set('Content-Type', 'application/json; charset=UTF-8');
  res.send(JSON.stringify({ loginApproach: global.loginApproach }));
  // log
  global.getId().then((id) => {
    global.log({
      id,
      level: 'info',
      type: `${global.setting.wechaty.name}.listener.http.login-approach`,
      content: null,
      timestamp: Date.now(),
    });
  });
});

// POST /rpc/logonoff
// eslint-disable-next-line max-len
app.post('/rpc/logonoff', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = tokenTest(req.body, global.setting.http.receiver.token);
  if (data.status >= 300) {
    res.status(data.status);
    res.send();
    // eslint-disable-next-line max-len
    wechatyLog.error(`${global.setting.wechaty.name}.listener.http.logonoff`, data.payload);
    return;
  }
  // logonoff
  const logonoff = global.robot ? global.robot.logonoff() : false;
  // response
  res.set('Content-Type', 'application/json; charset=UTF-8');
  res.send(JSON.stringify({ logonoff }));
  // log
  global.getId().then((id) => {
    global.log({
      id,
      level: 'info',
      type: `${global.setting.wechaty.name}.listener.http.logonoff`,
      content: null,
      timestamp: Date.now(),
    });
  });
});

// POST => /rpc/logout
// eslint-disable-next-line max-len
app.post('/rpc/logout', bodyParser.text({ type: '*/*' }), async (req, res) => {
  // request
  const data = tokenTest(req.body, global.setting.http.receiver.token);
  if (data.status >= 300) {
    res.status(data.status);
    res.send();
    // eslint-disable-next-line max-len
    wechatyLog.error(`${global.setting.wechaty.name}.listener.http.logout`, data.payload);
    return;
  }
  // logout
  await global.logout();
  // response
  res.status(204);
  res.send();
  // log
  global.log({
    id: await global.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.http.logout`,
    content: null,
    timestamp: Date.now(),
  });
});

// POST => /rpc/reply
app.post('/rpc/reply', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = replyTest(req.body, global.setting.http.receiver.token);
  if (data.status >= 300) {
    res.status(data.status);
    res.send();
    // eslint-disable-next-line max-len
    wechatyLog.error(`${global.setting.wechaty.name}.listener.http.reply`, data.payload);
    return;
  }
  // reply
  delete data.payload.token;
  wechat.reply(data.payload);
  // response
  res.status(204);
  res.send();
  // log
  global.getId().then((id) => {
    global.log({
      id,
      level: 'info',
      type: `${global.setting.wechaty.name}.listener.http.reply`,
      content: null,
      timestamp: Date.now(),
    });
  });
});

// POST => /rpc/send
app.post('/rpc/send', bodyParser.text({ type: '*/*' }), (req, res) => {
  // request
  const data = sendTest(req.body, global.setting.http.receiver.token);
  if (data.status >= 300) {
    res.status(data.status);
    res.send();
    // eslint-disable-next-line max-len
    wechatyLog.error(`${global.setting.wechaty.name}.listener.http.send`, data.payload);
    return;
  }
  // send
  delete data.payload.token;
  wechat.send(data.payload);
  // response
  res.status(204);
  res.send();
  // log
  global.getId().then((id) => {
    global.log({
      id,
      level: 'info',
      type: `${global.setting.wechaty.name}.listener.http.send`,
      content: null,
      timestamp: Date.now(),
    });
  });
});

// POST => /rpc/start
// eslint-disable-next-line max-len
app.post('/rpc/start', bodyParser.text({ type: '*/*' }), async (req, res) => {
  // request
  const data = tokenTest(req.body, global.setting.http.receiver.token);
  if (data.status >= 300) {
    res.status(data.status);
    res.send();
    // eslint-disable-next-line max-len
    wechatyLog.error(`${global.setting.wechaty.name}.listener.http.start`, data.payload);
    return;
  }
  // start
  await global.start();
  // response
  res.status(204);
  res.send();
  // log
  global.log({
    id: await global.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.http.start`,
    content: null,
    timestamp: Date.now(),
  });
});

// POST => /rpc/stop
// eslint-disable-next-line max-len
app.post('/rpc/stop', bodyParser.text({ type: '*/*' }), async (req, res) => {
  // request
  const data = tokenTest(req.body, global.setting.http.receiver.token);
  if (data.status >= 300) {
    res.status(data.status);
    res.send();
    // eslint-disable-next-line max-len
    wechatyLog.error(`${global.setting.wechaty.name}.listener.http.stop`, data.payload);
    return;
  }
  // stop
  await global.stop();
  // response
  res.status(204);
  res.send();
  // log
  global.log({
    id: await global.getId(),
    level: 'info',
    type: `${global.setting.wechaty.name}.listener.http.stop`,
    content: null,
    timestamp: Date.now(),
  });
});

const listen = () => {
  app.listen(global.setting.http.receiver.port, () => {
    // log
    global.getId().then((id) => {
      global.log({
        id,
        level: 'info',
        type: `${global.setting.wechaty.name}.listener.http.listen`,
        content: { port: global.setting.http.receiver.port },
        timestamp: Date.now(),
      });
    });
  });
};

export { listen };
