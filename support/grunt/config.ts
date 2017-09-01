import { Config } from 'webserv/commands/createServer';
import { middleware } from './config/webserv';
import { repositorySource } from 'grunt-dojo2-extras/src/util/environment';
import { join } from 'path';

export interface WebServerConfig {
	[ key: string ]: Config;
}

interface GruntConfig {
	[ key: string ]: any
}

interface TutorialDefinitions {
	[ key: string ]: string
}

const [ repoOwner, repoName ] = repositorySource().split('/');
const distDirectory = '_dist';
const siteDirectory = 'site';
const buildDirectory = '_build';
const binDirectory = join('node_modules', '.bin');
const apiDirectory = join(distDirectory, 'api');
const apiThemeDirectory = join(siteDirectory, 'themes/dojo/source/_api-theme');
const syncDirectory = '.sync';
const tempDirectory = '.apitemp';
const publishDirectory = '.ghpublish';
const htmlReportDirectory = 'html-report';

export const gruntConfig: GruntConfig = {
// ---------------------------------------------------------------------------------------------------------------------
// Variables
// ---------------------------------------------------------------------------------------------------------------------
	repoOwner: repoOwner,

	repoName: repoName,

	dojoProjectOwner: 'dojo',

	ghPagesBranch: 'gh-pages',

	binDirectory: binDirectory,
	distDirectory: distDirectory,
	buildDirectory: buildDirectory,
	siteDirectory: siteDirectory,
	apiDirectory: apiDirectory,
	apiThemeDirectory: apiThemeDirectory,
	syncDirectory: syncDirectory,
	tempDirectory: tempDirectory,
	publishDirectory: publishDirectory,
	htmlReportDirectory: htmlReportDirectory,

// This is considered the master branch as far as the CI is concerned
	masterBranch: 'master',

// ---------------------------------------------------------------------------------------------------------------------
// Task Configuration
// ---------------------------------------------------------------------------------------------------------------------
	api: {
		options: {
			dest: '<%= apiDirectory %>',
			filter: 'latest',
			format: 'html',
			typedoc: {
				mode: 'file',
				externalPattern: '**/+(example|examples|node_modules|tests|typings)/**/*.ts',
				excludeExternals: true,
				excludeNotExported: true,
				ignoreCompilerErrors: true,
				theme: '<%= apiThemeDirectory %>'
			}
		},

		cli: {
			options: {
				cloneDirectory: '<%= syncDirectory %>/cli',
				repo: 'dojo/cli'
			}
		},

		'cli-json': {
			options: {
				cloneDirectory: '<%= syncDirectory %>/cli',
				dest: '<%= apiDirectory %>/_json/cli.json',
				repo: 'dojo/cli',
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
	},

	clean: {
		api: [ '<%= tempDirectory %>' ],
		build: [ '<%= buildDirectory %>'],
		dist: [ '<%= distDirectory %>' ],
		publish: [ '<%= publishDirectory %>' ],
		sync: [ '<%= syncDirectory %>' ],
		compiledFiles: [ './+(tests|support)/**/*.d.ts', './+(tests|support)/**/*.js' ],
		htmlReport: [ '<%= htmlReportDirectory %>' ]
	},

	hexo: {
		generate: {
			src: '<%= siteDirectory %>',
			dest: '<%= distDirectory %>'
		}
	},

	intern: {
		unit: {
			options: {
				runType: 'client',
				config: '_build/tests/intern',
				reporters: [
					'Console', 'LcovHtml'
				]
			}
		}
	},

	prompt: {
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
	},

	publish: {
		'gh-pages': {
			options: {
				branch: 'gh-pages',
				cloneDirectory: '<%= distDirectory %>'
			}
		}
	},

	initAutomation: {
		repo: {
			options: {
				repoOwner: '<%= repoOwner %>',
				repoName: '<%= repoName %>'
			}
		}
	},

	shell: {
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
	},

	sync: {
		'gh-pages': {
			options: {
				branch: 'gh-pages',
				cloneDirectory: '<%= distDirectory %>'
			}
		}
	},

	tslint: {
		options: {
			configuration: 'tslint.json'
		},
		support: 'support/**/*.ts',
		site: [ 'site/**/*.ts', '!site/node_modules/**' ]
	},

	tutorials: {
		'dojo2-tutorials': {
			src: 'site/source/tutorials',
			dest: '<%= distDirectory %>/tutorials/assets'
		}
	},

	/**
	 * Host a local development server
	 */
	webserv: {
		server: {
			middleware
		}
	},

	copy: {
		'pretest-tutorials': {
			src: 'site/source/tutorials/**/demo/**/*',
			dest: '<%= buildDirectory %>/'
		}
	}
};

// Create config and task definitions for the tutorials to accomplish:
//		-- run npm install for each tutorial demo
//		-- run dojo test for each tutorial demo
const tutorialsTestDir = buildDirectory + '/site/source/tutorials';
export const tutorialLocations:TutorialDefinitions = {
	tutorial001Initial: tutorialsTestDir + '/001_static_content/demo/initial/biz-e-corp',
	tutorial001Finished: tutorialsTestDir + '/001_static_content/demo/finished/biz-e-corp',
	tutorial002Initial: tutorialsTestDir + '/002_creating_an_application/demo/initial/biz-e-corp',
	tutorial002Finished: tutorialsTestDir + '/002_creating_an_application/demo/finished/biz-e-corp',
	tutorial003Initial: tutorialsTestDir + '/003_creating_widgets/demo/initial/biz-e-corp',
	tutorial003Finished: tutorialsTestDir + '/003_creating_widgets/demo/finished/biz-e-corp',
	tutorial004Initial: tutorialsTestDir + '/004_user_interactions/demo/initial/biz-e-corp',
	tutorial004Finished: tutorialsTestDir + '/004_user_interactions/demo/finished/biz-e-corp',
	tutorial005Initial: tutorialsTestDir + '/005_form_widgets/demo/initial/biz-e-corp',
	tutorial005Finished: tutorialsTestDir + '/005_form_widgets/demo/finished/biz-e-corp',
	tutorial006Initial: tutorialsTestDir + '/006_containers_and_injecting_state/demo/initial/biz-e-corp',
	tutorial006DeployInitial: tutorialsTestDir + '/006_deploying_to_production/demo/initial/biz-e-corp'
};

const npmConfigObj = gruntConfig[ 'npm-command' ] = <GruntConfig>{};
const shellConfigObj = gruntConfig.shell;
Object.keys(tutorialLocations).forEach(function (tutorialName) {
	const npmConfigName = 'npm-' + tutorialName;
	const shellConfigName = 'dojo-test-' + tutorialName;

	npmConfigObj[npmConfigName] = {
		options: {
			cwd: tutorialLocations[tutorialName]
		}
	};

	shellConfigObj[shellConfigName] = {
		command: 'dojo test',
		options: {
			execOptions: {
				cwd: tutorialLocations[tutorialName]
			}
		}
	};
});
