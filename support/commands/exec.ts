const shell = require('shelljs');

export interface Result {
	code: number;
	stdout: string;
	stderr: string;
}

/**
 * Simplify usage of shelljs exec by wrapping it in a promise and handle error codes as rejections
 *
 * @param command the command to execute in a new shell
 * @param print write stdout and stderr to the console
 * @return {Promise<T>}
 */
export default function exec(command: string, print: boolean = true): Promise<Result> {
	return new Promise(function (resolve, reject) {
		shell.exec(command, { async: true }, function (code: number, stdout: Buffer, stderr: Buffer) {
			if (print) {
				console.log(stdout.toString());
				console.log(stderr.toString());
			}

			if (code === 0) {
				resolve({
					code,
					stdout,
					stderr
				});
			}
			else {
				const error = new Error(`exited with code ${ code }`);
				process.exitCode = code;
				reject(error);
			}
		});
	});
}
