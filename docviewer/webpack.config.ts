import { join } from 'path';
import { Configuration, optimize } from 'webpack';

const distPath = join(__dirname, '..', '_dist', 'js');

const config: Configuration = {
	devtool: 'source-map',
	entry: [
		'promise-polyfill/src/polyfill',
		'whatwg-fetch',
		join(__dirname, 'src', 'repo_docs.ts')
	],
	output: {
		filename: 'repo_docs.js',
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
	resolve: {
		extensions: ['.ts', '.js', '.json']
	}
};

if (process.env.NODE_ENV === 'production') {
	config.plugins!.push(new optimize.UglifyJsPlugin());
}

export default config;
