import { Config } from 'webserv/commands/createServer';
import { middleware } from './webserv';

interface WebServerConfig {
	[ key: string ]: Config
}

export * from '../support/common';

export const clean: any = {
	api: [ '<%= tempDirectory %>' ],
	dist: [ '<%= distDirectory %>' ],
	publish: [ '<%= publishDirectory %>' ]
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
