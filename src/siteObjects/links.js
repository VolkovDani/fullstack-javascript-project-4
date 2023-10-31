import { writeFile } from 'fs/promises';
import axios from 'axios';

const downloadLinks = ($, stringMaker) => {
  const arrPromises = [];
  const listLinks = $('link');

  listLinks.each((i, { attribs }) => {
    /**
   * Проверяет ссылку на ассет и в случае необходимости подставляет недостающие элементы ссылки
   * @returns url для скачивания ассета
   */
    const getHrefCurrentElement = () => {
      if (attribs.href.search(/\/(?<=^.)/g) === -1) return attribs.href;
      return stringMaker.makeStrSiteWithoutDirs(attribs.href);
    };
    const hrefCurrentElement = getHrefCurrentElement();
    const makingFile = (dataHref) => {
      let pathToFile;
      if (attribs.rel === 'canonical') pathToFile = stringMaker.makePathElementFile(hrefCurrentElement).concat('.html');
      else pathToFile = stringMaker.makePathElementFile(hrefCurrentElement);
      return writeFile(pathToFile, dataHref);
    };
    const downloadImage = axios.get(hrefCurrentElement, { responseType: 'document' })
      .then((response) => {
        makingFile(response.data);
      });

    arrPromises.push(downloadImage);
    // eslint-disable-next-line no-param-reassign
    if (attribs.rel === 'canonical') attribs.href = stringMaker.makeURLFileAsset(hrefCurrentElement).concat('.html');
    // eslint-disable-next-line no-param-reassign
    else attribs.href = stringMaker.makeURLFileAsset(hrefCurrentElement);
  });

  return Promise.all(arrPromises).then(() => $, stringMaker);
};

export default downloadLinks;
