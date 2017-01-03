#!/usr/bin/env node

import { distDirectory } from './common';
import runCommand from './commands/runCommand';
const shell = require('shelljs');

runCommand({
	dist() {
		shell.rm('-rf', distDirectory);
	},

	'default': 'dist'
});
