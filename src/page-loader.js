import axios from 'axios';
import { access, writeFile, mkdir } from 'fs/promises';
import * as cheerio from 'cheerio';
import { StringMaker } from '../utils/pathsAndStrings.js';

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
        .then(({ data }) => {
          const arrPromisesIMGs = [];
          const $ = cheerio.load(data);
          const arrImgs = $('img');
          const pathForFolderWithIMGs = stringMaker.makePathForFolderWithIMGs();
          arrImgs.each((i, el) => {
            let srcCurrentElement;
            if (el.attribs.src.search(/\/(?<=^.)/g) === -1) srcCurrentElement = el.attribs.src;
            else srcCurrentElement = stringMaker.makeStrSiteWithoutDirs(el.attribs.src);
            // Промис для создания файла с изображением
            const makingFile = (dataImg) => {
              const pathToImg = stringMaker.makePathToImg(srcCurrentElement);
              return writeFile(pathToImg, dataImg);
            };
            // Создать промис по скачиванию и созданию файла изображения
            // для каждого элемента и добавить в массив
            // чтобы потом отправить в Promise.all
            const downloadImage = axios.get(srcCurrentElement.startsWith('http') ? srcCurrentElement : 'https://'.concat(srcCurrentElement), { responseType: 'blob' })
              .then((response) => makingFile(response.data));

            arrPromisesIMGs.push(downloadImage);
            el.attribs.src = stringMaker.makeURLtoFileAsset(srcCurrentElement);
          });
          return mkdir(pathForFolderWithIMGs).then(() => Promise.all(arrPromisesIMGs))
            .then(() => writeFile(savePath, $.html()));
        })
        .then(() => resolve(savePath))
        .catch((err) => reject(err));
    });
});

export default pageloader;

// const result = await pageloader('https://ru.hexlet.io/courses', '/home/danil/Tests');
// console.log(result);
