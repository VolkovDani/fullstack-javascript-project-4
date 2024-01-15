#!/usr/bin/env node
import commanderConfig from '../src/cli.js';

const myFunc = () => {
  console.log(process.argv);
  return process.argv;
};

commanderConfig.parse(myFunc(), './src/page-loader.js');
