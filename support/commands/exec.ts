const shell = require('shelljs');

export default function exec(command: string, print: boolean = true): Promise<any> {
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
	})
}
