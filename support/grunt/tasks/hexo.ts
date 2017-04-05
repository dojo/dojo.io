import IMultiTask = grunt.task.IMultiTask;
import { exec } from '../../util/process';
import { join } from 'path';
import wrapProcess from '../commands/wrapProcess';

/**
 * Builds the hexo site
 */
export = function (grunt: IGrunt) {
	function buildTask(this: IMultiTask<any>) {
		const done = this.async();
		const siteDirectory = this.filesSrc[0];
		const hexoBin = join(siteDirectory, 'node_modules', '.bin', 'hexo');
		const proc = exec(`${ hexoBin } --cwd ${ siteDirectory } generate`, { silent: true });
		wrapProcess(proc, grunt.log, done);
	}

	grunt.registerMultiTask('hexo', buildTask)
};
