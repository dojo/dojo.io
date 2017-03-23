import { exec as execChild, spawn as spawnChild } from 'child_process';
import { ChildProcess } from 'child_process';

function applyOptions(options: any = {}) {
	options.encoding = options.encoding || 'utf8';
	options.stdio = options.stdio || (options.silent ? 'pipe' : 'inherit');
	return options;
}

export function promisify(proc: ChildProcess): Promise<ChildProcess> {
	return new Promise(function (resolve, reject) {
		proc.on('close', function (code) {
			if (code === 0) {
				resolve(proc);
			}
			else {
				process.exitCode = code;
				reject(new Error(`Process exited with a code of ${ code }`));
			}
		});
	});
}

export function exec(command: string, options?: any) {
	// Use execSync from child_process instead of shelljs.exec for better
	// handling of pass-through stdio
	return execChild(command, applyOptions(options));
}

export function promiseExec(command: string, options?: any) {
	return promisify(exec(command, options));
}

export function spawn(command: string, args: string[], options?: any) {
	return spawnChild(command, args, applyOptions(options));
}

export function promiseSpawn(command: string, args: string[], options?: any) {
	return promisify(spawn(command, args, options));
}
