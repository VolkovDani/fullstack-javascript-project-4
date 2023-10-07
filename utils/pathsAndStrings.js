import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const regExp = /[^\w]/g;
const regExpForLastChar = /-(?!.)/g;
/**
 * Правильная склейка путей до фикстур
 * @param  {...String} filenameFile Название файла в фикстурах
 * @returns Путь до фикстуры
 */
const fixturePath = (...filenameFile) => {
  const filename = fileURLToPath(import.meta.url);
  const myDirname = dirname(filename);
  return path.join(myDirname, '..', '__fixtures__', ...filenameFile);
};
/**
 * Изменяет переданную ссылку сайта в обозначенную регулярным выражением строку
 * @param {String} strUrlWebSite ссылка сайта(https://ru-hexlet-io-courses)
 * @returns Строка, где все символы заменены на "-" (ru-hexlet-io-courses)
 */
const makeRegularNameOfFileHTML = (strUrlWebSite) => {
  const urlWebSite = new URL(strUrlWebSite);
  return urlWebSite.href
    .split('//')[1]
    .replace(regExp, '-')
    .replace(regExpForLastChar, '');
};
/**
 * Функция нужна для создания правильного путя до ассетов
 * @param {String} strUrlWebSite ссылка сайта
 * @returns Хост сайта
 */
const makeStrSiteWithoutDirs = (strUrlWebSite) => {
  const urlWebSite = new URL(strUrlWebSite);
  return urlWebSite.host
    .replace(regExp, '-')
    .replace(regExpForLastChar, '');
};
/**
 * Нужен для создания относительного пути до файлой сайта, которые мы подставим
 * вместо старых данных
 * @param {String} elementSrc "Сырой" путь к файлу
 * @param {String} strToWebSite URL веб сайта который скачиваем
 * @returns Строка, которую подставим в новый HTML
 */
const makeURLtoFileAsset = (elementSrc, strToWebSite) => path.join(
  makeRegularNameOfFileHTML(strToWebSite).concat('_files'),
  elementSrc.replace(/[^\w^.]/g, '-').replace(/(?<!.)-/g, ''),
);

/**
 * Преобразует путь сохранения полученный от пользователя и url вебсайта
 * в ссылку для сохранения HTML файла сайта
 * @param {String} pathFile
 * @param {String} strWebSite
 * @returns Путь по которому будет сохранятся HTML
 */
const makePathToSavingHTML = (pathFile, strWebSite) => path
  .join(pathFile, makeRegularNameOfFileHTML(strWebSite).concat('.html'));

/**
 * Нужно для склейки путей до файлов изображений
 * @param {String} pathFile Путь до директории сохранения сайта
 * @param {String} strUrlWebSite Адрес вебсайта
 * @param {String} elementSrc Путь до файла изображения и его название
 * @returns Путь сохранения изображения
 */
const makePathToImg = (pathFile, strUrlWebSite, elementSrc) => {
  const regHTML = makeRegularNameOfFileHTML(strUrlWebSite);
  return path.join(
    pathFile,
    regHTML.concat('_files/'),
    regHTML.concat('-', elementSrc.replace(/[^\w^.]/g, '-').replace(/(?<!.)-/g, '')),
  );
};
/**
 * Функция для создания пути до папки с ассетами
 * @param {String} pathFile Путь до директории сохранения сайта
 * @param {String} strUrlWebSite Адрес вебсайта
 * @returns Путь до папки с ассетами
 */
const makePathForFolderWithIMGs = (pathFile, strUrlWebSite) => path.join(
  pathFile,
  makeRegularNameOfFileHTML(strUrlWebSite).concat('_files/'),
);

export {
  makePathToSavingHTML, fixturePath, makePathToImg,
  makeURLtoFileAsset, makePathForFolderWithIMGs, makeStrSiteWithoutDirs
};
