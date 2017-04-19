import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import loadModule from '../../_support/loadModule';
import { cleanupModuleMocks } from '../../_support/loadModule';
import { DocumentedApi, default as getApiPackagesInstance } from 'support/commands/getApiPackages';

let getApiPackages: typeof getApiPackagesInstance;

registerSuite({
	name: 'commands/hexo',

	before() {
		const mocks = {
			'fs': {
				readdirSync(dir: string) {
					if (dir === 'api') {
						return [
							'cli',
							'loader',
							'empty',
							'file',
							'_ignored'
						];
					}
					if (dir === 'api/cli') {
						return [
							'v2.0.0-alpha.12',
							'notasemver',
							'v2.0.0-beta1.1'
						];
					}
					if (dir === 'api/loader') {
						return [
							'v2.0.0-beta.9',
							'v2.0.0-beta1.1'
						];
					}
					if (dir === 'api/empty') {
						return [];
					}
					throw new Error(`unknown path ${ dir }`);
				},

				lstatSync(path: string) {
					if (path === 'api/cli'
						|| path === 'api/loader'
						|| path === 'api/_ignored'
						|| path === 'api/empty') {
						return {
							isDirectory() {
								return true;
							}
						}
					}
					if (path === 'api/file') {
						return {
							isDirectory() {
								return false;
							}
						}
					}
					throw new Error(`unknown path ${ path }`);
				}
			}
		};
		getApiPackages = loadModule('support/commands/getApiPackages', mocks);
	},

	teardown() {
		cleanupModuleMocks();
	},

	test() {
		const apis: DocumentedApi[] = getApiPackages('api');
		assert.deepEqual(apis, [
			{
				format: 'html',
				latest: 'v2.0.0-beta1.1',
				package: 'cli',
				versions: [
					'v2.0.0-alpha.12',
					'v2.0.0-beta1.1'
				]
			},
			{
				format: 'html',
				latest: 'v2.0.0-beta1.1',
				package: 'loader',
				versions: [
					'v2.0.0-beta.9',
					'v2.0.0-beta1.1'
				]
			},
			{
				format: 'html',
				latest: null,
				package: 'empty',
				versions: []
			}
		]);
	}
});
