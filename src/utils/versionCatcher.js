import { readFile } from 'fs/promises';
import path from 'path';
// Function for getting version project from package.json
const packageObj = await readFile(path.join(path.resolve(), './package.json'), 'utf-8');
export default JSON.parse(packageObj).version;
