import { readFileSync } from 'fs';
import path from 'path';
import { getPathWorkDir } from './getWorkPaths.js';

const packageObj = readFileSync(path.join(getPathWorkDir(), '../package.json'), 'utf-8');
export default JSON.parse(packageObj).version;
