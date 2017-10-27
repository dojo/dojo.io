import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { join } from 'path';
import loadModule from '../../_support/loadModule';
import { cleanupModuleMocks } from '../../_support/loadModule';
import getApiPackagesInstance from 'support/commands/getApiPackages';

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
					if (dir === join('api', 'cli')) {
						return [
							'v2.0.0-alpha.12',
							'notasemver',
							'v2.0.0-beta1.1'
						];
					}
					if (dir === join('api', 'loader')) {
						return [
							'v2.0.0-beta.9',
							'v2.0.0-beta1.1'
						];
					}
					if (dir === join('api', 'empty')) {
						return [];
					}
					throw new Error(`unknown path ${ dir }`);
				},

				lstatSync(path: string) {
					if (path === join('api', 'cli')
						|| path === join('api', 'loader')
						|| path === join('api', '_ignored')
						|| path === join('api', 'empty')) {
						return {
							isDirectory() {
								return true;
							}
						};
					}
					if (path === join('api', 'file')) {
						return {
							isDirectory() {
								return false;
							}
						};
					}
					throw new Error(`unknown path ${ path }`);
				}
			},
			'grunt-dojo2-extras/src/util/process': {
				exec(command: string) {
					const segments = command.split(/\s/);
					const packageInfo = segments[2];

					if (!packageInfo) {
						throw new Error(`unexpected command ${ command }`);
					}

					const packageNameAndTag = packageInfo.split('/')[1];

					if (!packageNameAndTag) {
						throw new Error(`unexpected command ${ command }`);
					}

					const [ packageName, tag ] = packageNameAndTag.split('@');

					if (!packageName || !tag) {
						throw new Error(`unexpected command ${ command }`);
					}

					if (packageName === 'cli') {
						return { stdout: '2.0.0-alpha.12' };
					}

					if (packageName === 'loader') {
						return { stdout: '2.0.0-beta.9' };
					}

					return { stdout: '' };
				}
			},
			'grunt-dojo2-extras/src/util/streams': {
				toString(stdout: string) {
					return Promise.resolve(stdout);
				}
			}
		};
		getApiPackages = loadModule('support/commands/getApiPackages', mocks);
	},

	teardown() {
		cleanupModuleMocks();
	},

	test() {
		return getApiPackages('api').then(apis => {
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
		});
	},

	testWithNpmTags() {
		return getApiPackages('api', {
			cli: { tag: 'beta2', scope: '@dojo' },
			loader: { tag: 'beta1', scope: '@dojo' }
		}).then(apis => {
			assert.deepEqual(apis, [
				{
					format: 'html',
					latest: 'v2.0.0-alpha.12',
					package: 'cli',
					versions: [
						'v2.0.0-alpha.12',
						'v2.0.0-beta1.1'
					]
				},
				{
					format: 'html',
					latest: 'v2.0.0-beta.9',
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
		});
	}
});
