import { Config } from 'webserv/commands/createServer';
import { middleware } from './webserv';

export interface WebServerConfig {
	[ key: string ]: Config;
}

// ---------------------------------------------------------------------------------------------------------------------
// Variables
// ---------------------------------------------------------------------------------------------------------------------
export * from '../support/common';

// ---------------------------------------------------------------------------------------------------------------------
// Task Configuration
// ---------------------------------------------------------------------------------------------------------------------
export const clean = {
	api: [ '<%= tempDirectory %>' ],
	dist: [ '<%= distDirectory %>' ],
	publish: [ '<%= publishDirectory %>' ],
	compiledFiles: [ './+(tasks|support)/**/*.d.ts', './+(tasks|support)/**/*.js' ]
};

export const shell = {
	'build-ts': {
		command: 'tsc',
		options: {
			execOptions: {
				cwd: 'support'
			}
		}
	}
};

/**
 * Host a local development server
 */
export const webserv: WebServerConfig = {
	server: {
		middleware
	}
};

// TODO build APIs

// TODO build gh-pages

// TODO build gh-pages
