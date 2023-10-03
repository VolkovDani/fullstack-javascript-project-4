import path from 'path';

const regExp = /[^\w]/g;
const regExpForLastChar = /-(?!.)/g;

const makePathToSavingFile = (pathFile, strWebSite) => {
  const urlWebSite = new URL(strWebSite);
  return path.join(
    pathFile,
    urlWebSite.href
      .split('//')[1]
      .replace(regExp, '-')
      .replace(regExpForLastChar, '')
      .concat('.html'),
  );
};

export { makePathToSavingFile };
