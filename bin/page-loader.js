#!/usr/bin/env node
import commanderConfig from '../src/cli.js';

commanderConfig.parse(['--colors'], './src/page-loader.js');
