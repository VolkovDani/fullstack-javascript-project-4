#!/usr/bin/env node
import commanderConfig from '../src/cli.js';

const myArgs = process.argv.filter((opt) => {
  const testParams = ['--colors', 'runInBand'];
  return testParams.includes(opt);
});
commanderConfig.parse(myArgs, './src/page-loader.js');
