#!/usr/bin/env node

import { runCommands } from './commands/runCommand';

runCommands(process.argv.slice(2).join(' ')).catch(error => {
	console.error(error);
});
