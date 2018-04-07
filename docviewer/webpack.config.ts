import { join } from 'path';
import { Configuration, optimize } from 'webpack';
const PolyfillInjectorPlugin = require('webpack-polyfill-injector');

const distPath = join(__dirname, '..', '_dist', 'js');

const config: Configuration = {
	devtool: 'source-map',
	entry: {
		repo_docs: `webpack-polyfill-injector?${JSON.stringify({
			modules: [join(__dirname, 'src', 'repo_docs.ts')]
		})}!`
	},
	output: {
		filename: '[name].js',
		path: distPath
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader'
			}
		]
	},
	plugins: [
		new PolyfillInjectorPlugin({
			polyfills: ['Promise', 'fetch']
		})
	],
	resolve: {
		extensions: ['.ts', '.js', '.json']
	}
};

if (process.env.NODE_ENV === 'production') {
	config.plugins!.push(new optimize.UglifyJsPlugin());
}

export default config;
