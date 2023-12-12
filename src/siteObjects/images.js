import { writeFile } from 'fs/promises';
import axios from 'axios';
import log from '../utils/debugEl.js';

const imagesLog = log.extend('images');

const downloadImages = ($, stringMaker) => {
  const arrPromisesIMGs = [];
  const listImgs = $('img');

  listImgs.each((i, { attribs }) => {
    /**
     * Проверяет ссылку на ассет и в случае необходимости подставляет недостающие элементы ссылки
     * @returns url для скачивания ассета
     */
    const getSrcCurrentElement = () => {
      if (attribs.src.search(/\/(?<=^.)/g) === -1) return attribs.src;
      return stringMaker.makeStrSiteWithoutDirs(attribs.src);
    };
    const srcCurrentElement = getSrcCurrentElement();
    // Промис для создания файла с изображением
    const makingFile = (dataImg) => {
      const pathToImg = stringMaker.makePathElementFile(srcCurrentElement);
      return writeFile(pathToImg, dataImg);
    };
    // Создать промис по скачиванию и созданию файла изображения
    // для каждого элемента и добавить в массив
    // чтобы потом отправить в Promise.all
    const downloadImage = axios.get(srcCurrentElement, { responseType: 'document' })
      .then((response) => {
        imagesLog('GET image: ', srcCurrentElement);
        return makingFile(response.data);
      })
      // eslint-disable-next-line no-param-reassign
      .catch((e) => {
        imagesLog('Error GET image:', e.message);
        return console.log('\x1b[1m', '\x1b[31m', `${e.name}: ${e.message} in asset 'link':\n${srcCurrentElement}`, '\x1b[0m');
      });

    arrPromisesIMGs.push(downloadImage);
    // eslint-disable-next-line no-param-reassign
    attribs.src = stringMaker.makeURLFileAsset(srcCurrentElement);
  });
  return Promise.all(arrPromisesIMGs).then(() => $, stringMaker);
};

export default downloadImages;
