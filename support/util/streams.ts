import { Readable } from 'stream';
import EventEmitter = NodeJS.EventEmitter;

interface Stream extends EventEmitter {
	readable: Readable['readable'];
	isPaused: Readable['isPaused'];
}

export function toString(stream: Stream): Promise<string> {
	if (!stream.readable && !stream.isPaused()) {
		return Promise.reject(new Error('stream is not readable'));
	}

	return new Promise(function (resolve, reject) {
		const chunks: string[] = [];

		stream.on('data', function (chunk: string) {
			chunks.push(chunk);
		}).on('error', function (error: Error) {
			reject(error);
		}).on('close', function () {
			resolve(chunks.join());
		}).on('end', function () {
			resolve(chunks.join());
		});
	});
}

export function equal(aStream: Stream, bStream: Stream) {
	return new Promise(function (resolve, reject) {
		const a = addListeners(aStream);
		const b = addListeners(bStream);
		let comparedLength = 0;

		function addListeners(stream: Stream) {
			const data = {
				data: '',
				closed: false
			};

			stream.on('data', function (chunk: string) {
				data.data += String(chunk);
				compare();
			}).on('error', function (error: Error) {
				reject(error);
			}).on('close', function () {
				data.closed = true;
				closed(data);
			}).on('end', function () {
				data.closed = true;
				closed(data);
			});

			return data;
		}

		function compare() {
			const max = Math.min(a.data.length, b.data.length);
			const toCompare = max - comparedLength;
			for (let i = 0; i < toCompare; i++) {
				if (a.data.charAt(i) !== b.data.charAt(i)) {
					reject(new Error(`Difference at ${ comparedLength } ${ a.data.charAt(i) }:${ b.data.charAt(i) }`));
				}
				comparedLength++;
			}
		}

		function closed(data: { data: string, closed: boolean }) {
			data.closed = true;
			compare();
			if (a.data.length > comparedLength || b.data.length > comparedLength) {
				reject(new Error(`Difference at ${ comparedLength }`));
			}
			if (a.closed && b.closed) {
				resolve();
			}
		}
	});
}
