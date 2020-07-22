import { ScanStatus } from 'wechaty';

const global = {
  loginApproach: {
    status: ScanStatus[ScanStatus.Unknown],
    url: '',
    qrcode: '',
    timestampMs: 0,
  },
  requestor: null, // choose `terminal` or `http` as requestor
  robot: null,
  setting: null,
  logout: null, // async function
  start: null, // async function
  stop: null, // async function
};

export { global };
