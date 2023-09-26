import axios from 'axios';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { stat, writeFile } from 'fs/promises';

const filename = fileURLToPath(import.meta.url);
const myDirname = dirname(filename);

const pageloader = (urlToSite, pathToSave = 'default') =>
  new Promise((resolve, reject) => {
    let pathToSaveFile = pathToSave;
    if (pathToSaveFile === 'default') pathToSaveFile = myDirname;
    const regExp = /[^\w]/g;
    const pathFile = new URL(urlToSite);
    // Получить файл с сайта
    // let siteRes;
    const getDataFromWeb = axios.get(urlToSite)
      .then((response) => {
        const siteRes = response.data;
        return resolve(siteRes);
        // console.log(response);
      });
    // Подготовить путь для сохранения файла
    const checkStatFolder = stat(pathToSaveFile)
      .then((statsData) => {
        if (!statsData.isDirectory()) {
          return reject(
            new Error('Is it not directory. You can not use this path for saving your file'),
          );
        }
        // Должны приклеить к имени директории имя файла, т.е. обработанную ссылку из urlToSite
        const finalPathToFile = path.join(
          pathToSaveFile,
          pathFile.href.split('//')[1].replace(regExp, '-'),
        );
        // Должен проверить, если есть файл с содержимым(?)
        // Я должен предупредить пользователя и спросить его желание о перезаписи файла(?)
        // Сохранить файл по pathToSave
        // Если pathToSave = default, сохранять в той же директории что и пользователь
        return resolve(finalPathToFile);
      });
      writeFile(finalPathToFile, siteRes, { encoding: 'utf-8', flag: 'wx' })
        .then(console.log);
  });

export default pageloader;

// const result = await pageloader('https://ru.hexlet.io/courses');
// console.log(result);
