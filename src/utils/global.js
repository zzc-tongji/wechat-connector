import { ScanStatus } from 'wechaty';

const global = {
  loginApproach: {
    status: ScanStatus[ScanStatus.Unknown],
    url: '',
    qrcode: '',
    timestamp: 0,
  },
  requestor: {
    id: null, // async function
    log: null, // async function
    report: null, // async function
  },
  robot: null,
  setting: null,
  logout: null, // async function
  start: null, // async function
  stop: null, // async function
};

export { global };
