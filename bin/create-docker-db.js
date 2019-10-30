#! /usr/bin/env node
const commander = require('commander');

const program = new commander.Command();
program.version('0.0.1');
program.parse(process.argv);

require('../lib/create')()
