import * as config from './config';
import { join, basename, extname } from 'path';
import { readdirSync } from 'fs';

export = function (grunt: IGrunt) {
	require('load-grunt-tasks')(grunt);

	const tasksDirectory = join(__dirname, 'tasks');
	readdirSync(tasksDirectory).filter(function (path) {
		return extname(path) === '.ts';
	}).forEach(function (file) {
		const mid = join(tasksDirectory, basename(file, '.ts'));
		console.log(mid);
		require(mid)(grunt);
	});

	grunt.initConfig(config);

	grunt.registerTask('test', [ 'shell:build-ts', 'clean:compiledFiles' ]);
};
