import IMultiTask = grunt.task.IMultiTask;
import { exec, promisify } from '../../util/process';
import { join } from 'path';
import wrapAsyncTask from '../commands/wrapAsyncTask';
import { writeFileSync } from 'fs';
import * as env from '../../util/environment';

/**
 * Builds the hexo site
 */
export = function (grunt: IGrunt) {
	function buildTask(this: IMultiTask<any>) {
		const siteDirectory = this.filesSrc[0];
		const hexoBin = join('node_modules', '.bin', 'hexo');
		const configs = [ '_config.yml' ];
		const options = this.options<any>({ });
		const overrideRoot = env.hexoRootOverride();

		if (options.overrides || overrideRoot) {
			const overrides = options.overrides || {};

			if (overrideRoot) {
				overrides.root = overrideRoot;
			}

			writeFileSync(join(siteDirectory, '_overrides.json'), JSON.stringify(overrides));
			configs.push('_overrides.json');
		}

		const proc = exec(`${ hexoBin } --config=${ configs.join(',') } generate`, { silent: false, cwd: siteDirectory });
		return promisify(proc);
	}

	grunt.registerMultiTask('hexo', wrapAsyncTask(buildTask));
};
