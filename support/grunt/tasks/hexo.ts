import IMultiTask = grunt.task.IMultiTask;
import wrapAsyncTask from 'grunt-dojo2-extras/tasks/util/wrapAsyncTask';
import { join } from 'path';
import { writeFileSync } from 'fs';
import * as env from 'grunt-dojo2-extras/src/util/environment';
import hexo from '../../commands/hexo';

/**
 * Builds the hexo site
 */
export = function (grunt: IGrunt) {
	async function buildTask(this: IMultiTask<any>) {
		const { src: [ siteDirectory ], dest: distDirectory } = this.files[0];
		const apiDirectory = join(distDirectory, 'api');
		const configs = [ '_config.yml' ];
		const options = this.options<any>({
			apiSource: join(siteDirectory, 'source/api/_apiTemplate.md'),
			apiTarget: join(siteDirectory, 'source/api/index.md'),
			npmTags: {
				cli: {
					scope: '@dojo',
					tag: 'beta2'
				},
				core: {
					scope: '@dojo',
					tag: 'beta2'
				},
				has: {
					scope: '@dojo',
					tag: 'beta2'
				},
				i18n: {
					scope: '@dojo',
					tag: 'beta2'
				},
				interfaces: {
					scope: '@dojo',
					tag: 'beta2'
				},
				routing: {
					scope: '@dojo',
					tag: 'beta2'
				},
				shim: {
					scope: '@dojo',
					tag: 'beta2'
				},
				widgets: {
					scope: '@dojo',
					tag: 'beta2'
				},
				'widget-core': {
					scope: '@dojo',
					tag: 'beta2'
				}
			}
		});
		const overrideRoot = env.hexoRootOverride();

		if (options.overrides || overrideRoot) {
			const overrides = options.overrides || {};

			if (overrideRoot) {
				overrides.root = overrideRoot;
			}

			writeFileSync(join(siteDirectory, '_overrides.json'), JSON.stringify(overrides));
			configs.push('_overrides.json');
		}

		await hexo({
			apiDirectory,
			apiTemplate: options.apiSource,
			apiTarget: options.apiTarget,
			npmTags: options.npmTags,
			configs,
			siteDirectory
		});
	}

	grunt.registerMultiTask('hexo', wrapAsyncTask(buildTask));
};
