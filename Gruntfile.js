require('ts-node').register({
	'compilerOptions': {
		module: 'commonjs',
		target: 'es6'
	}
});

const tsconfig = require('./tsconfig.json');
const config = require('./tasks/config');

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('webserv');

	grunt.initConfig(config);
};
