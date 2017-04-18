import * as config from './config';
import { join, basename, extname } from 'path';
import { readdirSync } from 'fs';
import { isCronJob } from '../util/environment';

export = function (grunt: IGrunt) {
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('webserv');
	grunt.loadNpmTasks('intern');

	const tasksDirectory = join(__dirname, 'tasks');
	readdirSync(tasksDirectory).filter(function (path) {
		return extname(path) === '.ts';
	}).forEach(function (file) {
		const mid = join(tasksDirectory, basename(file, '.ts'));
		require(mid)(grunt);
	});

	grunt.initConfig(config);

	grunt.registerTask('default', [ 'clean', 'sync', 'hexo' ]);
	grunt.registerTask('generate', [ 'hexo' ]);
	grunt.registerTask('test', [ 'clean:compiledFiles', 'tslint', 'shell:build-ts', 'intern' ]);
	grunt.registerTask('init', [ 'prompt:github', 'initAutomation' ]);

	if (isCronJob()) {
		grunt.registerTask('ci', [ 'prebuild', 'default', 'tutorials', 'api' ]);
	}
	else {
		grunt.registerTask('ci', [ 'prebuild', 'default', 'tutorials' ]);
	}
};
