import axios from 'axios';
import { access, writeFile } from 'fs/promises';
import { StringMaker } from './utils/pathsAndStrings.js';
import builderHtml from './builderHtml.js';

const pageloader = (strToSite, pathToSave = '/home/user/<current-dir>') => {
  let pathToSaveFile = pathToSave;
  if (pathToSaveFile === '/home/user/<current-dir>') pathToSaveFile = process.cwd();
  const stringMaker = new StringMaker(strToSite, pathToSaveFile);
  const savePath = stringMaker.makePathFileHTML();
  return new Promise((resolve, reject) => {
    // Путь для сохранения файла
    // Идёт проверка на наличие файла. Если есть, файл не будет начинать скачиваться.
    access(savePath).then(() => reject(new Error('File already exists.')))
    // Если файла нет(нет возможности узнать access), то продолжаем
      .catch(() => {
        axios.get(strToSite)
          .then(({ data }) => builderHtml(data, stringMaker))
          .then((htmlData) => writeFile(savePath, htmlData))
          .then(() => resolve(savePath))
          .catch((err) => reject(err));
      });
  });
};

export default pageloader;

// const result = await pageloader('https://ru.hexlet.io/courses', '/home/danil/Tests');
// console.log(result);
