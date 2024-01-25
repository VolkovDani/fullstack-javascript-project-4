import path from 'path';

export default class StringMaker {
  /**
   * Class for working with paths
   * @param {String} strUrlWebSite website url(string, not URL object)
   * @param {String} pathFile Path to saving files
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
 * Function for correct creating path to assets
 * @returns Host website
 */
  makeStrSiteWithoutDirs(attribSrc) {
    return `${this.urlWebSite.origin}${attribSrc}`;
  }

  /**
   * Changes src from DOM by removing all symbols different with letters to "-"
   * @param {String} elementSrc src element
   * @returns Changes all symbols to "-" instead "." before extension file
   */
  makeRegularNameSrcElement(elementSrc) {
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
   * Makes new path to file with website
   * @param {String} elementSrc Old path to website
   * @returns New path to file which we will use in new HTML file
   */
  makeURLFileAsset(elementSrc) {
    return path.join(
      this.stylizedURL.concat('_files'),
      this.makeRegularNameSrcElement(elementSrc),
    );
  }

  /**
   * Makes path for images
   * @param {String} elementSrc Path to image together with name file
   * @returns Path to saving
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
  * Makes path to folder with assets
  * @param {String} strUrlWebSite Website url(string)
  * @returns Path to folder with assets
  */
  makePathFolderAssets() {
    return path.join(
      this.pathFile,
      this.stylizedURL.concat('_files/'),
    );
  }

  /**
   * Makes path to saving HTML
   * @returns path
   */
  makePathFileHTML() {
    return path
      .join(this.pathFile, this.stylizedURL.concat('.html'));
  }
}
