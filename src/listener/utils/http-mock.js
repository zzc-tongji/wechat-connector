import express from 'express';
import { log as wechatyLog } from 'wechaty';

const mock = (app) => {
  // POST => /rpc/log
  app.post('/rpc/log', express.text({ type: 'application/json' }), (req, res) => {
    // mock
    //
    // echo as local log
    wechatyLog.info('[MOCK::LOG]', req.body);
    console.log();
    // response
    res.status(202);
    res.send();
  });
};

export { mock };
