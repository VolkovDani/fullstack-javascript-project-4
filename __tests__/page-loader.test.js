import { test, expect, afterEach } from '@jest/globals';
import nock from 'nock';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdtemp, readFile } from 'fs/promises';
import { tmpdir } from 'os';
import pageLoader from '../src/page-loader.js';

const filename = fileURLToPath(import.meta.url);
const myDirname = dirname(filename);
const fixturePath = (filenameFile) => path.join(myDirname, '..', '__fixtures__', filenameFile);

let pathToTempFolder;
let scope;
let result;
let pathToNewFile;

beforeEach(async () => {
  pathToTempFolder = `${await mkdtemp(path.join(tmpdir(), 'page-loader-'))}`;
  const responseAnswer = await readFile(fixturePath('Preparing/siteData'), 'utf-8');
  scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, responseAnswer);
  result = await pageLoader('https://ru.hexlet.io/courses', pathToTempFolder);
  pathToNewFile = path.join(pathToTempFolder, '/ru-hexlet-io-courses.html');
});

test('Return path test', async () => {
  // console.log(pathToTempFolder);
  // Программа должна вывести путь до сохранённого файла
  expect(result).toBe(pathToNewFile);
});

test('Second test', async () => {
  // Программа должна создать новый файл с скачанной страницей
  const fixtureResult = await readFile(fixturePath('result'), 'utf-8');
  const newFileContent = await readFile(pathToNewFile, 'utf-8');
  expect(newFileContent).toBe(fixtureResult);
});

afterEach(() => {
  scope.done();
});
