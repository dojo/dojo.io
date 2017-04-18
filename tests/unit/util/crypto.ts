import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as crypto from 'support/util/crypto';
import { Readable } from 'stream';
import { existsSync } from 'fs';
import { tmpFile } from '../../_support/tmpFiles';

registerSuite({
	name: 'util/crypto',

	async createDeployKey() {
		const tmp = tmpFile('deployKey');
		const keys = await crypto.createDeployKey(tmp);

		assert.isTrue(existsSync(keys.publicKey));
		assert.isTrue(existsSync(keys.privateKey));
	},

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
