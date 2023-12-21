import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const filename = fileURLToPath(import.meta.url);
const myDirname = dirname(filename);

/**
 * Правильная склейка путей до фикстур
 * @param  {...String} filenameFile Название файла в фикстурах
 * @returns Путь до фикстуры
*/
const getFixturePath = (...filenameFile) => path.join(myDirname, '..', '__fixtures__', ...filenameFile);

const getPathWorkDir = () => myDirname;

export { getFixturePath, getPathWorkDir };
