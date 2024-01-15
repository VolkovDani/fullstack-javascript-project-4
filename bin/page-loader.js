#!/usr/bin/env node
import commanderConfig from '../src/cli.js';

commanderConfig.parse([...process.argv, '--colors'], './src/page-loader.js');
