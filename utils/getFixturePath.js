import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

/**
 * Правильная склейка путей до фикстур
 * @param  {...String} filenameFile Название файла в фикстурах
 * @returns Путь до фикстуры
*/
export default (...filenameFile) => {
  const filename = fileURLToPath(import.meta.url);
  const myDirname = dirname(filename);
  return path.join(myDirname, '..', '__fixtures__', ...filenameFile);
};
