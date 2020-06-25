import bodyParser from 'body-parser';
import { log as wechatyLog } from 'wechaty';

import { errorhandler } from './http-error-handler';
import { validate as tokenValidate } from './http-validator/token';

const mock = (app) => {
  // POST => /rpc/id
  app.post('/rpc/id', bodyParser.text({ type: '*/*' }), (req, res) => {
    // request
    const data = errorhandler('.listener.http-mock.id', tokenValidate, req, res, true);
    if (data.status !== 200) {
      return;
    }
    // response
    res.set('content-type', 'application/json;charset=UTF-8');
    res.send({ id: Math.floor(Math.random() * 9007199254740991) });
  });
  // POST => /rpc/log
  app.post('/rpc/log', bodyParser.text({ type: '*/*', limit: '30mb' }), (req, res) => {
    // request
    const data = errorhandler('.listener.http-mock.log', tokenValidate, req, res, true);
    if (data.status !== 200) {
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
