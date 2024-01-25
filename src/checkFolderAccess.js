import { access } from 'fs/promises';

const checkFolderWithAssets = (path) => access(path)
  .then(() => {
    const userErr = { code: 'EEXIST' };
    throw userErr;
  })
  .catch((err) => {
    if (err.code === 'ENOENT') return;
    throw err;
  });

export default checkFolderWithAssets;
