import axios from 'axios';
import { access, writeFile } from 'fs/promises';
import StringMaker from '../utils/StringMaker.js';
import builderHtml from './builderHtml.js';

const errors = {
  ENOENT: 'No such directory. At first, make folder',
  EACCES: 'Not enough permissions in this folder',
};

const pageLoader = (strToSite, pathToSave = '/home/user/<current-dir>') => {
  let pathToSaveFile = pathToSave;
  if (pathToSaveFile === '/home/user/<current-dir>') pathToSaveFile = process.cwd();
  const stringMaker = new StringMaker(strToSite, pathToSaveFile);
  const savePath = stringMaker.makePathFileHTML();
  return new Promise((resolve, reject) => {
    // Путь для сохранения файла
    // Идёт проверка на наличие файла. Если есть, файл не будет начинать скачиваться.
    access(savePath).then(() => reject(new Error('File already exists.')))
    // Проверка на наличие папки с ассетами. Если есть, файлы не будут начинать скачиваться.
      .then(() => access(stringMaker.makePathFolderAssets()))
      .then(() => reject(new Error('Folder with assets already exists.')))
    // Если файла нет(нет возможности узнать access), то продолжаем
      .catch(() => {
        axios.get(strToSite)
          .then(({ data }) => builderHtml(data, stringMaker))
          .then((htmlData) => writeFile(savePath, htmlData))
          .then(() => resolve(savePath))
          .catch((err) => reject(new Error(errors[err.code] ?? `${err.name}: ${err.message}`)));
      });
  });
};

export default pageLoader;
