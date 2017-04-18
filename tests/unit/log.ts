import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as log from 'support/log';
import { TransportInstance, transports } from 'winston';
import { LogStream } from '../../support/log';

const cachedTransports: { [ key: string ]: TransportInstance } = {};

registerSuite({
	name: 'log',

	before() {
		for (let key in log.logger.transports) {
			cachedTransports[key] = log.logger.transports[key];
		}
		log.logger.clear();
	},

	after() {
		log.logger.clear();
		for (let key in cachedTransports) {
			log.logger.add(cachedTransports[key], null, true);
		}
	},

	async LogStream() {
		const memory = new transports.Memory();
		log.logger.add(memory, null, true);

		const expected = 'Hello World';
		const stream = new LogStream();

		stream.write(expected);
		stream.end();

		assert.strictEqual(memory.writeOutput[0], `info: ${ expected }`);
	}
});
