import axios from 'axios';
import { writeFile } from 'fs/promises';
import path from 'path';
import StringMaker from './utils/StringMaker.js';
import builderHtml from './builderHtml.js';
import checkFolderWithAssets from './checkFolderAccess.js';
import checkHTMLFileAccess from './checkHTMLFileAccess.js';

const errors = {
  ENOENT: 'No such directory. At first, make folder.',
  EACCES: 'Not enough permissions in this folder.',
};

const pageLoader = (strToSite, pathToSave = '') => {
  const pathToSaveFile = path.resolve(process.cwd(), pathToSave);
  const stringMaker = new StringMaker(strToSite, pathToSaveFile);
  const savePath = stringMaker.makePathFileHTML();
  return new Promise((resolve, reject) => {
    // Path for saving file
    // Check file exists. If exists file will not downloading
    checkHTMLFileAccess(savePath).then(() => {
      checkFolderWithAssets(stringMaker.makePathFolderAssets());
    }).catch((err) => {
      if (err.userErrMessage) reject(new Error(err.userErrMessage));
      reject(new Error(err));
    }).then(() => {
      axios.get(strToSite)
        .then(({ data }) => builderHtml(data, stringMaker))
        .then((htmlData) => writeFile(savePath, htmlData))
        .then(() => resolve(savePath))
        .catch((err) => reject(new Error(errors[err.code] ?? `${err.name}: ${err.message}`)));
    });
  });
};

export default pageLoader;
