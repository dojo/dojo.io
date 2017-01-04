#!/usr/bin/env node
/*
 * Clean the build
 */
import { distDirectory, publishDirectory, tempDirectory } from '../common';
const shell = require('shelljs');

const commands = {
	all() {
		return Promise.all([
			commands.dist(),
			commands.publish(),
			commands.api()
		]);
	},

	dist() {
		shell.rm('-rf', distDirectory);
	},

	publish() {
		shell.rm('-rf', publishDirectory)
	},

	api() {
		shell.rm('-rf', tempDirectory)
	},

	'default': 'all'
};

export default commands;
