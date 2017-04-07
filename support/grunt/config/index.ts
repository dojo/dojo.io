import { Config } from 'webserv/commands/createServer';
import { middleware } from './webserv';

export interface WebServerConfig {
	[ key: string ]: Config;
}

// ---------------------------------------------------------------------------------------------------------------------
// Variables
// ---------------------------------------------------------------------------------------------------------------------
export * from '../../common';

// ---------------------------------------------------------------------------------------------------------------------
// Task Configuration
// ---------------------------------------------------------------------------------------------------------------------
export const clean = {
	api: [ '<%= tempDirectory %>' ],
	dist: [ '<%= distDirectory %>' ],
	publish: [ '<%= publishDirectory %>' ],
	compiledFiles: [ './+(tasks|support)/**/*.d.ts', './+(tasks|support)/**/*.js' ]
};

export const hexo = {
	build: '<%= siteDirectory %>'
};

export const publish = {
	'gh-pages': {
		options: {
			branch: 'gh-pages',
			publishMode: 'commit',
			cloneDirectory: '<%= distDirectory %>'
		}
	}
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

export const sync = {
	'gh-pages': {
		options: {
			branch: 'gh-pages',
			cloneDirectory: '<%= distDirectory %>'
		}
	}
};

export const tutorials = {
	'dojo2-tutorials': {
		src: 'site/source/tutorials',
		dest: '<%= distDirectory %>/tutorials/assets'
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
