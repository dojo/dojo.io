import { rootDirectory } from '../common';
const shell = require('shelljs');

export interface Handler {
	(... args: string[]): Promise<void> | void;
}

export type HandlerMap = { [ key: string ]: Handler | string }

export default function runCommand(command: string, directive: string = 'default', args: string[] = []): Promise<void> {
	return new Promise<void>(function (resolve, reject) {
		try {
			const commands: HandlerMap = require(`../cli/${ command }`).default;
			const method = getMethod(commands, directive);

			console.log(`Running ${ command }`);

			if (method) {
				shell.cd(rootDirectory);
				resolve(method(... args));
			}
			else {
				listCommands(commands);
				reject(new Error('command not found'));
			}
		}
		catch (e) {
			console.error(`Command "${ command }" failed.`);
			console.log(e.stack);
			process.exitCode = 1;
			reject(e);
		}
	});
}

function listCommands(handlers: HandlerMap): void {
	var commands = [];
	for (let name in handlers) {
		commands.push(`"${ name }"`);
	}
	commands.sort();
	console.log(`Hi. Commands are: ${ commands.join(', ') }`);
}

function getMethod(handlers: HandlerMap, directive: string): Handler {
	const method = handlers[directive || 'default'];

	if (typeof method === 'string' && method in handlers) {
		return getMethod(handlers, method);
	}
	else if (typeof method === 'function') {
		return method;
	}
}

export async function runCommands(... commands: string[]) {
	for (let i = 0; i < commands.length; i++) {
		const [command, ... args] = commands[i].split(' ');
		const directive = (args[0] || '')[0] === '-' ? 'default' : args.shift();
		await runCommand(command, directive, args);
	}
}
