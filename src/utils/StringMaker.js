import path from 'path';

export default class StringMaker {
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
    this.stylizedURL = this.urlWebSite.href
      .split('//')[1]
      .replace(this.regExpNonLetters, '-')
      .replace(this.regExpForLastChar, '');
  }

  isLocalHost(src) {
    const { host } = this.urlWebSite;
    const assetUrl = new URL(src);
    if (host === assetUrl.host) return true;
    return false;
  }

  /**
 * Функция нужна для создания правильного путя до ассетов
 * @returns Хост сайта
 */
  makeStrSiteWithoutDirs(attribSrc) {
    return `${this.urlWebSite.origin}${attribSrc}`;
  }

  /**
   * Изменяет переданный src элемента DOM, заменяя все символы отличные от букв и цифр на "-"
   * @param {String} elementSrc src элемента который обрабатываем
   * @returns Заменяет все символы на "-", кроме "." перед расширение файла
   */
  makeRegularNameSrcElement(elementSrc) {
    // Нужна для того чтобы оставить знак точки у расширения файла
    const funcOfReplacing = (match, offset, string) => {
      const lenOfStr = string.length;
      if (offset > lenOfStr - 5 && match === '.') return '.';
      return '-';
    };
    return elementSrc
      .replace(/.{1,}\/\//g, '')
      .replace(this.regExpNonLetters, funcOfReplacing)
      .replace(/(?<!.)-/g, '')
      .replace(this.regExpForLastChar, '');
  }

  /**
   * Нужен для создания относительного пути до файла сайта, которые мы подставим
   * вместо старых данных
   * @param {String} elementSrc Старый путь к файлу
   * @returns Новый путь к файлу, который подставим в новый HTML
   */
  makeURLFileAsset(elementSrc) {
    return path.join(
      this.stylizedURL.concat('_files'),
      this.makeRegularNameSrcElement(elementSrc),
    );
  }

  /**
   * Нужно для склейки путей до файлов изображений
   * @param {String} elementSrc Путь до файла изображения и его название
   * @returns Путь сохранения изображения
  */
  makePathElementFile(elementSrc) {
    const regHTML = this.stylizedURL;
    return path.join(
      this.pathFile,
      regHTML.concat('_files/'),
      this.makeRegularNameSrcElement(elementSrc),
    );
  }

  /**
  * Функция для создания пути до папки с ассетами
  * @param {String} strUrlWebSite Адрес вебсайта
  * @returns Путь до папки с ассетами
  */
  makePathFolderAssets() {
    return path.join(
      this.pathFile,
      this.stylizedURL.concat('_files/'),
    );
  }

  /**
   * Преобразует путь сохранения полученный от пользователя и url вебсайта
   * в ссылку для сохранения HTML файла сайта
   * @returns Путь по которому будет сохранятся HTML
   */
  makePathFileHTML() {
    return path
      .join(this.pathFile, this.stylizedURL.concat('.html'));
  }
}
