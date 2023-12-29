import * as cheerio from 'cheerio';
import { mkdir } from 'fs/promises';
import Listr from 'listr';

import downloadImages from './siteObjects/images.js';
import downloadLinks from './siteObjects/links.js';
import downloadScripts from './siteObjects/scripts.js';

// Здесь происходит передача страницы сайта
// с последующей обработкой с заменой ссылок и скачиванием всех файлов
export default (siteData, stringMaker) => {
  const $ = cheerio.load(siteData);

  const promisesDict = {
    images: () => downloadImages($, stringMaker),
    links: () => downloadLinks($, stringMaker),
    scripts: () => downloadScripts($, stringMaker),
  };

  const tasks = new Listr(Object.entries(promisesDict).map(([name, func]) => {
    const titleTask = name;
    return {
      title: titleTask,
      task: func,
    };
  }), { concurrent: true });

  const pathFolderAssets = stringMaker.makePathFolderAssets();
  return new Promise((resolve, reject) => {
    mkdir(pathFolderAssets)
      .then(() => tasks.run())
      .then(() => resolve($.html()))
      .catch(reject);
  });
};
