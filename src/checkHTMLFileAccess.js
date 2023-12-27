import { readFile } from 'fs/promises';

const checkHTMLFileAccess = (path) => readFile(path)
  .then(() => {
    const errorObj = {
      userErrMessage: 'HTML file already exists.',
    };
    throw errorObj;
  })
  .catch((err) => {
    if (err.code === 'ENOENT') return;
    throw err;
  });

export default checkHTMLFileAccess;
