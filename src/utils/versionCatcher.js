import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
// Function for getting version project from package.json
const packageObj = await readFile(path.join(dirname, '../../package.json'), 'utf-8');
export default JSON.parse(packageObj).version;
