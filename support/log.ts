import { Logger, transports } from 'winston';
import { Writable, WritableOptions } from 'stream';

export const logger = new Logger({
	level: 'debug',
	transports: [
		new transports.Console({
			showLevel: false
		})
	]
});

export class LogStream extends Writable {
	private buffer: string;

	readonly level: string;

	constructor(level: string = 'info', opts: WritableOptions = undefined) {
		super(opts);
		this.buffer = '';
		this.level = level;
	}

	end(): void;
	end(chunk: any, cb?: Function): void;
	end(chunk: any, encoding?: string, cb?: Function): void;
	end(chunk?: any, encoding?: any, cb?: Function): void {
		super.end(chunk, encoding, cb);

		if (this.buffer.length) {
			this.writeLog(this.buffer);
		}

		this.emit('end');
	}

	_write(chunk: any, encoding: string, callback: Function): void {
		if (encoding === 'buffer') {
			encoding = 'utf-8';
		}

		this.writeLogMultiline(typeof chunk === 'string' ? chunk : chunk.toString(encoding));

		callback && callback();
	}

	private writeLog(str: string) {
		logger.log(this.level, str.trim());
	}

	private writeLogMultiline(chunk: string) {
		const pieces = (this.buffer + chunk).split('\n');
		this.buffer = pieces.pop();

		for (let str of pieces) {
			this.writeLog(str.trim());
		}
	}
}

export default logger;
