import * as cheerio from 'cheerio';
import { mkdir } from 'fs/promises';

import downloadImages from './siteObjects/images.js';
import downloadLinks from './siteObjects/links.js';
import downloadScripts from './siteObjects/scripts.js';

// Здесь происходит передача страницы сайта
// с последующей обработкой с заменой ссылок и скачиванием всех файлов
export default (siteData, stringMaker) => new Promise((resolve, reject) => {
  const $ = cheerio.load(siteData);
  const arrPromises = [
    downloadImages($, stringMaker),
    downloadLinks($, stringMaker),
    downloadScripts($, stringMaker),
  ];
  const pathFolderAssets = stringMaker.makePathFolderAssets();
  mkdir(pathFolderAssets)
    .then(() => Promise.all(arrPromises))
    .then(() => resolve($.html()))
    .catch(reject);
});
