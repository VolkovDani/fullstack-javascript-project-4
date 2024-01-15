#!/usr/bin/env node
import commanderConfig from '../src/cli.js';

const myArgs = process.argv.filter((opt) => opt !== '--colors');
commanderConfig.parse(myArgs, './src/page-loader.js');
