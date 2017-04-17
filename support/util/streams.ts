import { Readable } from 'stream';
import EventEmitter = NodeJS.EventEmitter;
import { logger } from '../log';

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

export function equal(a: Stream, b: Stream) {
	return new Promise(function (resolve, reject) {
		let aData = '';
		let bData = '';
		let comparedLength = 0;

		function compare() {
			const max = Math.min(aData.length, bData.length);
			const toCompare = max - comparedLength;
			for (let i = 0; i < toCompare; i++) {
				if (aData.charAt(i) !== bData.charAt(i)) {
					logger.info('difference', i);
					throw new Error(`Difference at ${ comparedLength } ${ aData.charAt(i) }:${ bData.charAt(i) }`);
				}
				comparedLength++;
			}
		}

		a.on('data', function (chunk: string) {
			aData += String(chunk);
			compare();
		}).on('error', function (error: Error) {
			reject(error);
		}).on('close', function () {
			aData = null;
			if (bData === null) {
				resolve();
			}
		}).on('end', function () {
			aData = null;
			if (bData === null) {
				resolve();
			}
		});

		b.on('data', function (chunk: string) {
			bData += String(chunk);
			compare();
		}).on('error', function (error: Error) {
			reject(error);
		}).on('close', function () {
			bData = null;
			if (aData === null) {
				resolve();
			}
		}).on('end', function () {
			bData = null;
			if (aData === null) {
				resolve();
			}
		});
	});
}
