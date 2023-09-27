import axios from 'axios';
import { stat, writeFile } from 'fs/promises';
import path from 'path';
// import { fileURLToPath } from 'url';

// const filename = fileURLToPath(import.meta.url);
// const myDirname = dirname(filename);

const pageloader = (urlToSite, pathToSave = 'default') => new Promise((resolve, reject) => {
  let pathToSaveFile = pathToSave;
  if (pathToSaveFile === '/home/user/<current-dir>') pathToSaveFile = process.cwd();

  const regExp = /[^\w]/g;
  const regExpForLastChar = /-(?!.)/g;
  const pathFile = new URL(urlToSite);

  const getDataFromWeb = axios.get(urlToSite).then((response) => {
    const siteRes = response.data;
    return siteRes;
  });

  const checkStatFolder = stat(pathToSaveFile).then((statsData) => {
    if (!statsData.isDirectory()) {
      throw new Error('Is it not directory. You can not use this path for saving your file');
    }
    const finalPathToFile = path.join(pathToSaveFile, pathFile.href.split('//')[1].replace(regExp, '-').replace(regExpForLastChar, '').concat('.html'));
    return finalPathToFile;
  });

  Promise.all([getDataFromWeb, checkStatFolder]).then(
    ([response, pathToNewFile]) => {
      // console.log(response);
      writeFile(pathToNewFile, response, { encoding: 'utf-8', flag: 'wx' }).then(() => {
        resolve(pathToNewFile);
      });
    },
  ).catch((err) => reject(err));
});

export default pageloader;

// const result = await pageloader('https://ru.hexlet.io', '/home/danil/Tests');
// console.log(result);
