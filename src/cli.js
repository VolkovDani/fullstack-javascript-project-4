import { Command } from 'commander';
import pageLoader from './page-loader.js';

const commanderConfig = new Command();

commanderConfig
  .description('Page loader utility')
  .version('0.0.1')
  .arguments('<url>')
  .option(
    '-o, --output <path>',
    'output dir',
    '/home/user/<current-dir>',
  )
  .action((url) => {
    // eslint-disable-next-line no-console
    pageLoader(url, commanderConfig.opts().output).then(console.log).catch(() => console.log('Something wrong'));
  });

export default commanderConfig;
