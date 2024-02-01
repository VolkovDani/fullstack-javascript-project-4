import axios from 'axios';
import { writeFile } from 'fs/promises';
import path from 'path';
import StringMaker from './utils/StringMaker.js';
import downloaderAssets from './downloaderAssets.js';
import checkAccess from './checkAccess.js';

const errors = {
  ENOENT: 'No such directory. At first, make folder.',
  EACCES: 'Not enough permissions in this folder.',
  EEXIST: 'Folder with assets already exists.',
};

const pageLoader = (strToSite, pathToSave = '') => {
  const pathToSaveFile = path.resolve(process.cwd(), pathToSave);
  let url;
  try {
    url = new URL(strToSite);
  } catch (err) {
    throw new Error('It is wrong URL string');
  }
  const stringMaker = new StringMaker(url, pathToSaveFile);
  const savePath = stringMaker.makePathFileHTML();
  // Path for saving file
  // Check file exists. If exists file will not downloading
  return checkAccess(savePath).then(() => {
    checkAccess(stringMaker.makePathFolderAssets());
  }).catch((err) => { throw new Error(errors[err.code] ?? `${err.name}: ${err.message}`); })
    .then(() => axios.get(strToSite)
      .then(({ data }) => downloaderAssets(data, stringMaker))
      .then((htmlData) => writeFile(savePath, htmlData))
      .then(() => savePath)
      .catch((err) => { throw new Error(errors[err.code] ?? `${err.name}: ${err.message}`); }))
    .then((res) => res);
};

export default pageLoader;
