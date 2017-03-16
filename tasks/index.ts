import * as config from './config';

export = function (grunt: IGrunt) {
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('webserv');

	grunt.initConfig(config);

	grunt.registerTask('test', [ 'shell:build-ts', 'clean:compiledFiles' ]);
};
