import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Правильная склейка путей до фикстур
 * @param  {...String} filenameFile Название файла в фикстурах
 * @returns Путь до фикстуры
*/
const fixturePath = (...filenameFile) => {
  const filename = fileURLToPath(import.meta.url);
  const myDirname = dirname(filename);
  return path.join(myDirname, '../..', '__fixtures__', ...filenameFile);
};

class StringMaker {
  /**
   * Класс с методами для преобразования строк и путей
   * @param {String} strUrlWebSite Ссылка на сайт который скачиваем
   * @param {String} pathFile Путь для сохранения файла
   */
  constructor(strUrlWebSite, pathFile) {
    this.pathFile = pathFile;
    this.regExpNonLetters = /[^\w]/g;
    this.regExpForLastChar = /-(?!.)/g;

    this.urlWebSite = new URL(strUrlWebSite);
    this.regularNameOfFileHTML = this.urlWebSite.href
      .split('//')[1]
      .replace(this.regExpNonLetters, '-')
      .replace(this.regExpForLastChar, '');
  }

  /**
 * Функция нужна для создания правильного путя до ассетов
 * @returns Хост сайта
 */
  makeStrSiteWithoutDirs(attribSrc) {
    return (this.urlWebSite.hostname.replace(this.regExpForLastChar, '')).concat(attribSrc);
  }

  /**
   * Изменяет переданный src элемента DOM, заменяя все символы отличные от букв и цифр на "-"
   * @param {String} elementSrc src элемента который обрабатываем
   * @returns Заменяет все символы на "-", кроме "." перед расширение файла
   */
  makeRegularNameOfSrcElement(elementSrc) {
    const funcOfReplacing = (match, offset, string) => {
      const lenOfStr = string.length;
      if (offset > lenOfStr - 5 && match === '.') return '.';
      return '-';
    };
    return elementSrc
      .replace(/.{1,}\/\//g, '')
      .replace(this.regExpNonLetters, funcOfReplacing)
      .replace(/(?<!.)-/g, '');
  }

  /**
   * Нужен для создания относительного пути до файла сайта, которые мы подставим
   * вместо старых данных
   * @param {String} elementSrc Старый путь к файлу
   * @returns Новый путь к файлу, который подставим в новый HTML
   */
  makeURLtoFileAsset(elementSrc) {
    return path.join(
      this.regularNameOfFileHTML.concat('_files'),
      this.makeRegularNameOfSrcElement(elementSrc),
    );
  }

  /**
   * Нужно для склейки путей до файлов изображений
   * @param {String} elementSrc Путь до файла изображения и его название
   * @returns Путь сохранения изображения
  */
  makePathToImg(elementSrc) {
    const regHTML = this.regularNameOfFileHTML;
    return path.join(
      this.pathFile,
      regHTML.concat('_files/'),
      this.makeRegularNameOfSrcElement(elementSrc),
    );
  }

  /**
  * Функция для создания пути до папки с ассетами
  * @param {String} strUrlWebSite Адрес вебсайта
  * @returns Путь до папки с ассетами
  */
  makePathForFolderWithIMGs() {
    return path.join(
      this.pathFile,
      this.regularNameOfFileHTML.concat('_files/'),
    );
  }

  /**
   * Преобразует путь сохранения полученный от пользователя и url вебсайта
   * в ссылку для сохранения HTML файла сайта
   * @returns Путь по которому будет сохранятся HTML
   */
  makePathToSavingHTML() {
    return path
      .join(this.pathFile, this.regularNameOfFileHTML.concat('.html'));
  }
}

export { fixturePath, StringMaker };
