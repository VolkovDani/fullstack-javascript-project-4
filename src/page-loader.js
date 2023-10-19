import axios from 'axios';
import { access, writeFile } from 'fs/promises';
import { StringMaker } from './utils/pathsAndStrings.js';
import downloadImages from './siteObjects/image.js';

const pageloader = (strToSite, pathToSave = '/home/user/<current-dir>') => new Promise((resolve, reject) => {
  let pathToSaveFile = pathToSave;
  if (pathToSaveFile === '/home/user/<current-dir>') pathToSaveFile = process.cwd();
  const stringMaker = new StringMaker(strToSite, pathToSaveFile);
  // Путь для сохранения файла
  const savePath = stringMaker.makePathToSavingHTML();
  // Идёт проверка на наличие файла. Если есть, файл не будет начинать скачиваться.
  access(savePath).then(() => reject(new Error('File already exists.')))
  // Если файла нет(нет возможности узнать access), то продолжаем
    .catch(() => {
      axios.get(strToSite)
        .then(({ data }) => downloadImages(data, stringMaker))
        .then((htmlData) => writeFile(savePath, htmlData))
        .then(() => resolve(savePath))
        .catch((err) => reject(err));
    });
});

export default pageloader;

// const result = await pageloader('https://ru.hexlet.io/courses', '/home/danil/Tests');
// console.log(result);
