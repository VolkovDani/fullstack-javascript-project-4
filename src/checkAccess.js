import { access } from 'fs/promises';

export default (path) => access(path)
  .then(() => {
    const userErr = { code: 'EEXIST' };
    throw userErr;
  })
  .catch((err) => {
    if (err.code === 'ENOENT') return;
    throw err;
  });
