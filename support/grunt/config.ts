import { Config } from 'webserv/commands/createServer';
import { middleware } from './config/webserv';
import { repositorySource } from 'grunt-dojo2-extras/src/util/environment';
import { join } from 'path';

export interface WebServerConfig {
	[ key: string ]: Config;
}

// ---------------------------------------------------------------------------------------------------------------------
// Variables
// ---------------------------------------------------------------------------------------------------------------------
export const [ repoOwner, repoName ] = repositorySource().split('/');

export const dojoProjectOwner = 'dojo';

export const ghPagesBranch = 'gh-pages';

export const binDirectory = join('node_modules', '.bin');

export const distDirectory = '_dist';

export const siteDirectory = 'site';

export const syncDirectory = '.sync';

export const publishDirectory = '.ghpublish';

// This is considered the master branch as far as the CI is concerned
export const masterBranch = 'master';

// ---------------------------------------------------------------------------------------------------------------------
// Task Configuration
// ---------------------------------------------------------------------------------------------------------------------
export const clean = {
	dist: [ '<%= distDirectory %>' ],
	publish: [ '<%= publishDirectory %>' ],
	sync: [ '<%= syncDirectory %>' ],
	compiledFiles: [ './+(tests|support)/**/*.d.ts', './+(tests|support)/**/*.js' ]
};

export const hexo = {
	generate: {
		src: '<%= siteDirectory %>',
		dest: '<%= distDirectory %>'
	}
};

export const intern = {
	version: 4
};

export const prompt = {
	github: {
		options: {
			questions: [
				{
					config: 'github.username',
					type: 'input',
					message: 'Github username'
				},
				{
					config: 'github.password',
					type: 'password',
					message: 'Github password'
				}
			]
		}
	}
};

export const publish = {
	'gh-pages': {
		options: {
			branch: 'gh-pages',
			cloneDirectory: '<%= distDirectory %>'
		}
	}
};

export const initAutomation = {
	repo: {
		options: {
			repoOwner: '<%= repoOwner %>',
			repoName: '<%= repoName %>'
		}
	}
};

export const shell = {
	'build-tests': {
		command: 'tsc',
		options: {
			execOptions: {
				cwd: 'tests'
			}
		}
	},
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

export const tslint = {
	options: {
		configuration: 'tslint.json'
	},
	support: 'support/**/*.ts',
	site: [ 'site/**/*.ts', '!site/node_modules/**' ]
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
