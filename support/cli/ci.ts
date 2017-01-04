#!/usr/bin/env node

import { runCommands } from '../commands/runCommand';

/*
 * Builds the documentation, tutorial, and blog site into static templates
 */

const commands = {
	'default'() {
		return runCommands(
			'clean',
			'sync',
			'build',
			// 'api all',
			'publish'
		);
	}
};

export default commands;
