import axios from 'axios';
import { writeFile } from 'fs/promises';
import path from 'path';
import StringMaker from './utils/StringMaker.js';
import builderHtml from './builderHtml.js';
import checkAccess from './checkAccess.js';

const errors = {
  ENOENT: 'No such directory. At first, make folder.',
  EACCES: 'Not enough permissions in this folder.',
  EEXIST: 'Folder with assets already exists.',
};

const pageLoader = (strToSite, pathToSave = '') => {
  const pathToSaveFile = path.resolve(process.cwd(), pathToSave);
  const stringMaker = new StringMaker(strToSite, pathToSaveFile);
  const savePath = stringMaker.makePathFileHTML();
  return new Promise((resolve, reject) => {
    // Path for saving file
    // Check file exists. If exists file will not downloading
    checkAccess(savePath).then(() => {
      checkAccess(stringMaker.makePathFolderAssets());
    }).catch((err) => reject(new Error(errors[err.code] ?? `${err.name}: ${err.message}`))).then(() => {
      axios.get(strToSite)
        .then(({ data }) => builderHtml(data, stringMaker))
        .then((htmlData) => writeFile(savePath, htmlData))
        .then(() => resolve(savePath))
        .catch((err) => reject(new Error(errors[err.code] ?? `${err.name}: ${err.message}`)));
    });
  });
};

export default pageLoader;
