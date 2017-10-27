import IMultiTask = grunt.task.IMultiTask;
import wrapAsyncTask from 'grunt-dojo2-extras/tasks/util/wrapAsyncTask';
import { join } from 'path';
import { writeFileSync } from 'fs';
import * as env from 'grunt-dojo2-extras/src/util/environment';
import { hexo, hexoClean } from '../../commands/hexo';

/**
 * Builds the hexo site
 */
export = function (grunt: IGrunt) {
	async function buildTask(this: IMultiTask<any>) {
		const { src: [ siteDirectory ] } = this.files[0];
		const configs = [ '_config.yml' ];
		const options = this.options<any>({});
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
			configs,
			siteDirectory
		});
	}

	grunt.registerMultiTask('hexo', wrapAsyncTask(buildTask));
	grunt.registerTask('hexoClean', function () {
		const done = this.async();
		hexoClean(this.options<any>({ target: 'site' }).target).then(done);
	});
};
