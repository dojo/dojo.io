import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as crypto from 'support/util/crypto';
import { Readable } from 'stream';

registerSuite({
	name: 'support/util/crypto',

	async encrypt() {
		const expected = 'Hello World!';
		const result = await new Promise(function (resolve) {
			let out = '';
			const stream = new Readable();
			stream.push(expected);
			stream.push(null);
			const enc = crypto.encryptData(stream);
			crypto.decryptData(enc.encrypted, enc.key, enc.iv)
				.on('data', function (chunk: string) {
					out += chunk;
				})
				.on('end', function () {
					resolve(out);
				});
		});
		assert.strictEqual(result, expected);
	}
});
