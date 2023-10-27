import * as cheerio from 'cheerio';
import { writeFile, mkdir } from 'fs/promises';
import axios from 'axios';

const downloadImages = async (data, stringMaker) => {
  const arrPromisesIMGs = [];
  const $ = cheerio.load(data);
  const arrImgs = $('img');
  const pathForFolderWithIMGs = stringMaker.makePathForFolderWithIMGs();
  arrImgs.each((i, el) => {
    /**
     * Проверяет ссылку на ассет и в случае необходимости подставляет недостающие элементы ссылки
     * @returns url для скачивания ассета
     */
    const getSrcCurrentElement = () => {
      if (el.attribs.src.search(/\/(?<=^.)/g) === -1) return el.attribs.src;
      return stringMaker.makeStrSiteWithoutDirs(el.attribs.src);
    };
    const srcCurrentElement = getSrcCurrentElement();
    // Промис для создания файла с изображением
    const makingFile = (dataImg) => {
      const pathToImg = stringMaker.makePathToImg(srcCurrentElement);
      return writeFile(pathToImg, dataImg);
    };
    // Создать промис по скачиванию и созданию файла изображения
    // для каждого элемента и добавить в массив
    // чтобы потом отправить в Promise.all
    const downloadImage = axios.get(srcCurrentElement, { responseType: 'blob' })
      .then((response) => makingFile(response.data));

    arrPromisesIMGs.push(downloadImage);
    // eslint-disable-next-line no-param-reassign
    el.attribs.src = stringMaker.makeURLtoFileAsset(srcCurrentElement);
  });
  return mkdir(pathForFolderWithIMGs)
    .then(() => Promise.all(arrPromisesIMGs))
    .then(() => $.html());
};

export default downloadImages;
