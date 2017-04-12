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
export const api = {
	options: {
		buildDirectory: '<%= tempDirectory %>',
		dest: '<%= apiDirectory %>',
		filter: '>=2.0.0-beta',
		format: 'html',
		themeDirectory: '<%= apiThemeDirectory %>'
	},

	cli: {
		options: {
			repo: 'dojo/cli'
		}
	},

	'cli-json': {
		options: {
			repo: 'dojo/cli',
			dest: '<%= apiDirectory %>/_json/cli.json',
			format: 'json'
		}
	},

	compose: {
		options: {
			repo: 'dojo/compose'
		}
	},

	core: {
		options: {
			repo: 'dojo/core'
		}
	},

	has: {
		options: {
			repo: 'dojo/has'
		}
	},

	interfaces: {
		options: {
			repo: 'dojo/interfaces'
		}
	},

	i18n: {
		options: {
			repo: 'dojo/i18n'
		}
	},

	loader: {
		options: {
			repo: 'dojo/loader'
		}
	},

	routing: {
		options: {
			repo: 'dojo/routing'
		}
	},

	shim: {
		options: {
			repo: 'dojo/shim'
		}
	},

	stores: {
		options: {
			repo: 'dojo/stores'
		}
	},

	streams: {
		options: {
			repo: 'dojo/streams'
		}
	},

	'widget-core': {
		options: {
			repo: 'dojo/widget-core'
		}
	},

	widgets: {
		options: {
			repo: 'dojo/widgets'
		}
	}
};

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

export const tslint = {
	options: {
		configuration: 'tslint.json'
	},
	support: {
		src: 'support/**/*.ts'
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
