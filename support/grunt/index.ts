import * as config from './config';
import { basename, extname, join } from 'path';
import { readdirSync } from 'fs';
import * as env from 'grunt-dojo2-extras/src/util/environment';

function shouldBuildApi() {
	const message = env.commitMessage() || '';
	return env.isCronJob() || message.indexOf('[build-api]') !== -1;
}

export = function (grunt: IGrunt) {
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('webserv');
	grunt.loadNpmTasks('intern');
	grunt.loadNpmTasks('grunt-dojo2-extras');

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
	grunt.registerTask('ci-api', [ 'prebuild', 'clean', 'sync', 'api', 'hexo', 'tutorials' ]);
	grunt.registerTask('ci-site', [ 'prebuild', 'default', 'tutorials' ]);
	grunt.registerTask('ci', shouldBuildApi() ? [ 'ci-api' ] : [ 'ci-site']);
};
