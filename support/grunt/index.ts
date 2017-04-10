import * as config from './config';
import { join, basename, extname } from 'path';
import { readdirSync } from 'fs';
import { isCronJob } from '../util/environment';

export = function (grunt: IGrunt) {
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('webserv');

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
	grunt.registerTask('test', [ 'tslint', 'shell:build-ts', 'clean:compiledFiles' ]);

	if (isCronJob()) {
		grunt.registerTask('ci', [ 'default', 'api' ]);
	}
	else {
		grunt.registerTask('ci', [ 'default' ]);
	}
};
