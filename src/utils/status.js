import { global } from './global';

const getStatus = () => {
  return global.robot ? (global.robot.logonoff() ? 'ready' : 'logged-out') : 'stopped';
};

export { getStatus };
