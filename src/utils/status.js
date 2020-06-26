import { global } from './global';

const getStatus = () => {
  return global.robot ? (global.robot.logonoff() ? 'logged-in' : 'logged-out') : 'stopped';
};

export { getStatus };
