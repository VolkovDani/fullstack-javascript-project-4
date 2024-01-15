#!/usr/bin/env node
import commanderConfig from '../src/cli.js';

const myArgs = process.argv.filter((opt) => opt !== '--colors' || '--runInBand');
commanderConfig.parse(myArgs, './src/page-loader.js');
