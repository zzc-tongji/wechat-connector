import bodyParser from 'body-parser';
import { log as wechatyLog } from 'wechaty';

import { global } from '../utils/global';
import { test as tokenTest } from './http-validator/token';

const mock = (app) => {
  // POST => /rpc/id
  app.post('/rpc/id', bodyParser.text({ type: '*/*' }), (req, res) => {
    // request
    const data = tokenTest(req.body, global.setting.http.sender.token);
    if (data.status >= 300) {
      res.status(data.status);
      res.send();
      return;
    }
    // response
    res.set('Content-Type', 'application/json; charset=UTF-8');
    res.send({ id: Math.floor(Math.random() * 9007199254740991) });
  });
  // POST => /rpc/log
  app.post('/rpc/log', bodyParser.text({ type: '*/*' }), (req, res) => {
    // request
    const data = tokenTest(req.body, global.setting.http.sender.token);
    if (data.status >= 300) {
      res.status(data.status);
      res.send();
      return;
    }
    // echo
    wechatyLog.info('[MOCK]', req.body);
    console.log();
    // response
    res.status(202);
    res.send();
  });
};

export { mock };
