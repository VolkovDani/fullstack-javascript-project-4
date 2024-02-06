import { access } from 'fs/promises';
import log from './utils/debugEl.js';

export default (path) => {
  const logTool = log.extend('checkAccess');
  return access(path)
    .then(() => {
      logTool('Check access: ', `${path}`);
      const userErr = { code: 'EEXIST' };
      throw userErr;
    })
    .catch((err) => {
      logTool('Error access: ', `${path}, err.code: ${err.code}`);
      if (err.code === 'ENOENT') return;
      throw err;
    });
};
