import axios from 'axios';
import { access, writeFile } from 'fs/promises';
import { makePathToSavingFile as makePath } from '../utils/pathsAndStrings.js';
// import { fileURLToPath } from 'url';

// const filename = fileURLToPath(import.meta.url);
// const myDirname = dirname(filename);

const pageloader = (strToSite, pathToSave = '/home/user/<current-dir>') => new Promise((resolve, reject) => {
  let pathToSaveFile = pathToSave;
  if (pathToSaveFile === '/home/user/<current-dir>') pathToSaveFile = process.cwd();
  const savePath = makePath(pathToSaveFile, strToSite);
  // Идёт проверка на наличие файла. Если есть, файл не будет начинать скачиваться.
  access(savePath).then(() => reject(new Error('File already exists.')))
    .catch(() => {
      axios.get(strToSite)
        .then(({ data }) => writeFile(savePath, data, { encoding: 'utf-8', flag: 'wx' }))
        .then(() => resolve(savePath))
        .catch((err) => reject(err));
    });
});

export default pageloader;

// const result = await pageloader('https://ru.hexlet.io', '/home/danil/Tests');
// console.log(result);
