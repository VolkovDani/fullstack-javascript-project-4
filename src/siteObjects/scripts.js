import { writeFile } from 'fs/promises';
import axios from 'axios';
import log from '../utils/debugEl.js';

const scriptsLog = log.extend('scripts');

const downloadScripts = ($, stringMaker) => {
  const arrPromises = [];
  const listImgs = $('script');

  listImgs.each((i, { attribs }) => {
    if (!attribs.src) return;
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
    const makingFile = (dataScript) => {
      const pathToScript = stringMaker.makePathElementFile(srcCurrentElement);
      return writeFile(pathToScript, dataScript);
    };
    // Создать промис по скачиванию и созданию файла изображения
    // для каждого элемента и добавить в массив
    // чтобы потом отправить в Promise.all
    const downloadScript = axios.get(srcCurrentElement, { responseType: 'document' })
      .then((response) => {
        scriptsLog('GET scripts: ', srcCurrentElement);
        makingFile(response.data);
      })
      .catch((e) => {
        scriptsLog('Error scripts', e.message);
        console.error(`${e.name}: ${e.message} in asset 'link':\n${srcCurrentElement}`);
      });

    arrPromises.push(downloadScript);
    // eslint-disable-next-line no-param-reassign
    attribs.src = stringMaker.makeURLFileAsset(srcCurrentElement);
  });
  return Promise.all(arrPromises).then(() => $, stringMaker);
};

export default downloadScripts;
