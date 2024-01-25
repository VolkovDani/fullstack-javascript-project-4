import { readFileSync } from 'fs';
import path from 'path';
import { getPathWorkDir } from './getWorkPaths.js';
// Function for getting version project from package.json
const packageObj = readFileSync(path.join(getPathWorkDir(), '../package.json'), 'utf-8');
export default JSON.parse(packageObj).version;
