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
    pageLoader(url, commanderConfig.opts().output).then(console.log).catch(() => console.log('something wrong'));
  });

export default commanderConfig;
