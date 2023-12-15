import nock from 'nock';

import path from 'path';
import {
  mkdtemp, readFile, readdir, rmdir,
} from 'fs/promises';
import { tmpdir } from 'os';
import pageLoader from '../src/page-loader.js';
import getFixturePath from '../utils/getFixturePath.js';

nock.disableNetConnect();
/**
 * Этот флаг для выбора, сохранять ли тестовые файлы в папке tmp
 * true = сохранять;
 * false = не сохранять
 */
const saveTempFiles = false;

let pathToTempFolder;
let scope;
let scope2;
let scope3;
let pathToNewFile;
let result;

beforeEach(async () => {
  const responseAnswer = await readFile(getFixturePath('./preparing/siteData'), 'utf-8');
  // Можно ли сделать не так громоздко?
  scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, responseAnswer)
    .get('/assets/professions/nodejs.png')
    .replyWithFile(200, getFixturePath('testAssets/image_nodejs.png'))
    .get('/assets/application.css')
    .replyWithFile(200, getFixturePath('testAssets/application.css'))
    .get('/courses')
    .replyWithFile(200, getFixturePath('testAssets/ru-hexlet-io-courses.html'))
    .get('/packs/js/runtime.js')
    .replyWithFile(200, getFixturePath('testAssets/ru-hexlet-io-packs-js-runtime.js'));
  scope2 = nock('https://cdn2.hexlet.io')
    .get('/assets/menu.css')
    .replyWithFile(200, getFixturePath('testAssets/menu.css'));
  scope3 = nock('https://js.stripe.com')
    .get('/v3/')
    .replyWithFile(200, getFixturePath('testAssets/js-stripe-com-v3'));

  pathToTempFolder = `${await mkdtemp(path.join(tmpdir(), 'test-files-page-loader-'))}`;
  pathToNewFile = path.join(pathToTempFolder, '/ru-hexlet-io-courses.html');
  result = await pageLoader('https://ru.hexlet.io/courses', pathToTempFolder);
});

test('Return path test', async () => {
  // Программа должна вывести путь до сохранённого файла
  expect(result).toBe(pathToNewFile);
});

test('Correct result', async () => {
  // Программа должна создать новый файл с скачанной страницей
  const fixtureResult = await readFile(getFixturePath('result'), 'utf-8');
  const newFileContent = await readFile(pathToNewFile, 'utf-8');
  expect(newFileContent).toBe(fixtureResult);
});

test('Downloading imgs', async () => {
  const dataImg = (await readFile(path.join(pathToTempFolder, 'ru-hexlet-io-courses_files', 'ru-hexlet-io-assets-professions-nodejs.png'))).toString();
  const dataFixtureImg = (await readFile(getFixturePath('testAssets/image_nodejs.png'))).toString();
  expect(dataImg).toBe(dataFixtureImg);
});

test('Downloading Additional Assets', async () => {
  const arrNeededFiles = ((await readFile(getFixturePath('listLinks&Scripts'), 'utf-8')).split('\n')).sort();
  const arrFilesInFolder = (await readdir(path.join(pathToTempFolder, 'ru-hexlet-io-courses_files'))).sort();
  expect(arrFilesInFolder).toEqual(arrNeededFiles);
});

afterEach(async () => {
  scope.done();
  scope2.done();
  scope3.done();
  if (saveTempFiles) await rmdir(pathToTempFolder, { recursive: true });
});
