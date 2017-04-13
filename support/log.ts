import { Logger, transports } from 'winston';

export const logger = new Logger({
	level: 'debug',
	transports: [
		new transports.Console()
	]
});

export default logger;
