import 'intern';

export const loaderOptions = {
	packages: [
		{ name: 'tslib', location: './node_modules/tslib', main: 'tslib.js' },
		{ name: 'support', location: './_build/support' },
		{ name: 'tests', location: './_build/tests' }
	]
};

export const suites = [ 'tests/unit/all' ];

export const excludeInstrumentation = /^(?:tests|node_modules)\//;

export const loaders = {
	'host-node': '@dojo/loader'
};

export const filterErrorStack = true;
