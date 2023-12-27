import { readdir } from 'fs/promises';

const checkFolderWithAssets = (path) => readdir(path)
  .then(() => {
    const errorObj = {
      userErrMessage: 'Folder with assets already exists.',
    };
    throw errorObj;
  })
  .catch((err) => {
    if (err.code === 'ENOENT') return;
    throw err;
  });

export default checkFolderWithAssets;
