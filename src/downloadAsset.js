/* eslint-disable no-param-reassign */
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import Listr from 'listr';
import log from './utils/debugEl.js';

export default (siteData, mainUrl, mainPathFile) => {
  const $ = cheerio.load(siteData);
  const needs = {
    img: 'src',
    link: 'href',
    script: 'src',
  };
  const promisesObj = {
    img: [],
    link: [],
    script: [],
  };
  const regExpNonLetters = /[^\w]/g;
  const regExpForLastChar = /-(?!.)/g;
  const pathToFolder = mainUrl.href.split('//')[1]
    .replace(regExpNonLetters, '-')
    .replace(regExpForLastChar, '')
    .concat('_files');

  Object.keys(needs).forEach((nameAsset) => {
    const listItems = $(nameAsset);
    listItems.each((i, { attribs }) => {
      const makeStrSiteWithoutDirs = (attr) => `${mainUrl.origin}${attr}`;
      const map = {
        img: () => makeStrSiteWithoutDirs(attribs.src),
        link: () => {
          if (attribs.href.search(/\/(?<=^.)/g) === -1) return false;
          return makeStrSiteWithoutDirs(attribs.href);
        },
        script: () => {
          if (!attribs.src) return false;
          let srcCurrentElement;
          if (attribs.src.search(/\/(?<=^.)/g) === -1) {
            const { host } = mainUrl;
            const assetUrl = new URL(attribs.src);
            if (host !== assetUrl.host) return false;
            srcCurrentElement = attribs.src;
          } else {
            srcCurrentElement = makeStrSiteWithoutDirs(attribs.src);
          }
          return srcCurrentElement;
        },
      };
      const removeSymbols = (str) => {
        const words = str.replace(/.{1,}\/\//g, '').split(regExpNonLetters);
        const ext = words.pop();
        return words.join('-').concat(`.${ext}`);
      };
      const removeSymbolsAndExt = (str) => {
        const words = str.replace(/.{1,}\/\//g, '').split(regExpNonLetters);
        return words.join('-');
      };
      const urlForAsset = map[nameAsset]();
      if (urlForAsset) {
        const makingFile = (dataAsset) => {
          const makePath = () => path.join(
            mainPathFile,
            pathToFolder,
            removeSymbols(urlForAsset),
          );
          let pathToAsset;
          if (nameAsset === 'link') {
            if (attribs.rel === 'canonical' || (attribs.rel === 'alternate' && attribs.type !== 'application/rss+xml')) {
              pathToAsset = path.join(
                mainPathFile,
                pathToFolder,
                removeSymbolsAndExt(urlForAsset),
              ).concat('.html');
            } else {
              pathToAsset = makePath();
            }
          } else {
            pathToAsset = makePath();
          }
          return writeFile(pathToAsset, dataAsset);
        };
        const logTool = log.extend(nameAsset);
        const downloadProcess = axios.get(urlForAsset, { responseType: 'arraybuffer' })
          .then((response) => {
            logTool(`GET ${nameAsset}:`, urlForAsset);
            return makingFile(response.data);
          })
          .catch((e) => {
            logTool(`Error GET ${nameAsset}:`, e.message);
            // eslint-disable-next-line no-console
            return console.error(`${e.name}: ${e.message} in asset '${nameAsset}': ${urlForAsset}`);
          });
        promisesObj[nameAsset].push(downloadProcess);
        if (nameAsset === 'link') {
          if (attribs.rel === 'canonical') attribs.href = path.join(pathToFolder, removeSymbolsAndExt(urlForAsset)).concat('.html');
          else attribs.href = path.join(pathToFolder, removeSymbols(urlForAsset));
        } else {
          attribs.src = path.join(pathToFolder, removeSymbols(urlForAsset));
        }
      }
    });
  });
  const pathToFolderAssets = path.join(
    mainPathFile,
    pathToFolder,
  );
  const tasks = new Listr(Object.keys(promisesObj).map((key) => {
    const title = key;
    const task = () => Promise.all(promisesObj[key]);
    return {
      title,
      task,
    };
  }), { concurrent: true });
  return mkdir(pathToFolderAssets)
    .then(() => tasks.run())
    .then(() => $.html());
};
