import { test, expect, afterEach } from '@jest/globals';
import nock from 'nock';

import path from 'path';
import { mkdtemp, readFile, readdir, rmdir } from 'fs/promises';
import { tmpdir } from 'os';
import pageLoader from '../src/page-loader.js';
import { fixturePath } from '../src/utils/pathsAndStrings.js';

nock.disableNetConnect();
/**
 * Этот флаг для выбора, сохранять ли тестовые файлы в папке tmp
 * true = сохранять
 * false = не сохранять
 */
const saveTmpFiles = false;

let pathToTempFolder;
let scope;
let pathToNewFile;
let result;

beforeEach(async () => {
  const responseAnswer = await readFile(fixturePath('./Preparing/siteData'), 'utf-8');
  scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, responseAnswer)
    .get('/assets/professions/nodejs.png')
    .replyWithFile(200, fixturePath('image_nodejs.png'));

  pathToTempFolder = `${await mkdtemp(path.join(tmpdir(), 'page-loader-'))}`;
  pathToNewFile = path.join(pathToTempFolder, '/ru-hexlet-io-courses.html');
  result = await pageLoader('https://ru.hexlet.io/courses', pathToTempFolder);
});

test('Return path test', async () => {
  // Программа должна вывести путь до сохранённого файла
  expect(result).toBe(pathToNewFile);
});

test('Correct result', async () => {
  // Программа должна создать новый файл с скачанной страницей
  const fixtureResult = await readFile(fixturePath('result'), 'utf-8');
  const newFileContent = await readFile(pathToNewFile, 'utf-8');
  expect(newFileContent).toBe(fixtureResult);
});

test('Downloading imgs', async () => {
  const dataImg = (await readFile(path.join(pathToTempFolder, 'ru-hexlet-io-courses_files', 'ru-hexlet-io-assets-professions-nodejs.png'))).toString();
  const dataFixtureImg = (await readFile(fixturePath('image_nodejs.png'))).toString();
  expect(dataImg).toBe(dataFixtureImg);
});

test('Downloading Additional Assets', async () => {
  const arrNeededFiles = ((await readFile(fixturePath('listLinks&Scripts'), 'utf-8')).split('\n'));
  const arrFilesInFolder = (await readdir(path.join(pathToTempFolder, 'ru-hexlet-io-courses_files')));
  expect(arrFilesInFolder).toBe(arrNeededFiles);
})

afterEach(async () => {
  scope.done();
  if (saveTmpFiles) await rmdir(pathToTempFolder, { recursive: true });
});
