import IMultiTask = grunt.task.IMultiTask;
import { exec, promisify } from '../../util/process';
import { join } from 'path';
import wrapAsyncTask from '../commands/wrapAsyncTask';

/**
 * Builds the hexo site
 */
export = function (grunt: IGrunt) {
	function buildTask(this: IMultiTask<any>) {
		const siteDirectory = this.filesSrc[0];
		const hexoBin = join(siteDirectory, 'node_modules', '.bin', 'hexo');
		const proc = exec(`${ hexoBin } --cwd ${ siteDirectory } generate`, { silent: false });
		return promisify(proc);
	}

	grunt.registerMultiTask('hexo', wrapAsyncTask(buildTask));
};
