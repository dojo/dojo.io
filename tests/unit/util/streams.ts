import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as streams from 'support/util/streams';
import { Readable } from 'stream';
import { EventEmitter } from 'events';

function assertReject(promise: Promise<any>) {
	return promise.then(function () {
		throw new Error('expected rejection');
	}, function () {
		return;
	});
}

function createStream(data: string): Readable {
	const stream = new Readable();
	stream.push(data);
	stream.push(null);
	return stream;
}

registerSuite({
	name: 'util/streams',

	toString: {
		'stream is not readable; rejects'() {
			const mock = {
				readable: false,
				isPaused() {
					return false;
				}
			};
			return assertReject(streams.toString(<any> mock));
		},

		'stream throws error; rejects'() {
			const mock: any = <any> new EventEmitter();
			mock.readable = true;

			const promise = assertReject(streams.toString(mock));
			mock.emit('error', new Error());

			return promise;
		},

		async 'stream is converted to a string'() {
			const expected = 'Hello World';
			const stream = createStream(expected);

			const value = await streams.toString(stream);
			assert.strictEqual(value, expected);
		}
	},

	equal: {
		'stream a errors; rejects'() {
			const mock: any = <any> new EventEmitter();
			const b = new Readable();

			const promise = assertReject(streams.equal(mock, b));
			mock.emit('error', new Error());

			return promise;
		},

		'stream b errors; rejects'() {
			const a = new Readable();
			const mock: any = <any> new EventEmitter();

			const promise = assertReject(streams.equal(a, mock));
			mock.emit('error', new Error());

			return promise;
		},

		'stream a is longer than stream b; rejects'() {
			const a = createStream('Hello World');
			const b = createStream('Hello');

			return assertReject(streams.equal(a, b));
		},

		'stream b is longer than stream a; rejects'() {
			const b = createStream('Hello World');
			const a = createStream('Hello');

			return assertReject(streams.equal(a, b));
		},

		'stream a is different than stream b; rejects'() {
			const b = createStream('Hello World');
			const a = createStream('Hola World!');

			return assertReject(streams.equal(a, b));
		},

		'streams are identical; resolves'() {
			const b = createStream('Hello World');
			const a = createStream('Hello World');

			return streams.equal(a, b);
		}
	}
});
