import { Readable } from 'stream';

export function toString(buffer: Readable): Promise<string> {
	if (!buffer.readable && !buffer.isPaused()) {
		return Promise.reject(new Error('buffer is not readable'));
	}

	return new Promise(function (resolve, reject) {
		const chunks: string[] = [];

		buffer.on('data', function (chunk: string) {
			chunks.push(chunk);
		});

		buffer.on('error', function (error: Error) {
			reject(error);
		});

		buffer.on('close', function () {
			resolve(chunks.join());
		});
	});
}
