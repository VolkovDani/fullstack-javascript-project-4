import { test, expect } from '@jest/globals';
import pageLoader from '../bin/page-loader.js';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const myDirname = dirname(filename);
const getFixturePath = (filenameFile) => path.join(myDirname, '..', '__fixtures__', filenameFile);

test('First test', () => {
  expect(pageLoader()).toBe(0)
})