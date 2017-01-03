import { rootDirectory } from '../common';
const shell = require('shelljs');

export interface Handler {
	(): void;
}

export type HandlerMap = { [ key: string ]: Handler | string }

export default function runCommand(handlers: HandlerMap): void {
	const directive = process.argv[process.argv.length - 1];

	const method = getMethod(handlers, directive);

	if (method) {
		shell.cd(rootDirectory);
		method();
	}
	else {
		listCommands(handlers);
	}
}

function listCommands(handlers: HandlerMap): void {
	var commands = [];
	for (let name in handlers) {
		commands.push(`"${ name }"`);
	}
	commands.sort();
	console.log(`Hi. Commands are: ${ commands.join(', ') }`);
}

function getMethod(handlers: HandlerMap, directive: string): () => {} | void {
	const method = handlers[directive];

	if (!method && 'default' in handlers) {
		return getMethod(handlers, 'default');
	}
	if (typeof method === 'string' && method in handlers) {
		return getMethod(handlers, method);
	}
	else if (typeof method === 'function') {
		return method;
	}
}
