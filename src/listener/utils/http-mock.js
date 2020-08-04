import bodyParser from 'body-parser';
import { log as wechatyLog } from 'wechaty';

import { errorhandler } from './http-error-handler';
import { validate as tokenValidate } from './http-validator/token';

const mock = (app) => {
  // POST => /rpc/log
  app.post('/rpc/log', bodyParser.text({ type: 'application/json', limit: '30mb' }), (req, res) => {
    // request
    const data = errorhandler('.listener.http-mock.log', tokenValidate, req, res, true);
    if (data.status !== 200) {
      return;
    }
    // echo
    wechatyLog.info('[MOCK::LOG]', req.body);
    console.log();
    // response
    res.status(202);
    res.send();
  });
};

export { mock };
