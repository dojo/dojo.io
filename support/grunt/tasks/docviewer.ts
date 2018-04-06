import IMultiTask = grunt.task.IMultiTask;
import wrapAsyncTask from 'grunt-dojo2-extras/tasks/util/wrapAsyncTask';
import { exec, promisify } from 'grunt-dojo2-extras/src/util/process';
import { join } from 'path';

/**
 * Builds the docviewer
 */
export = function (grunt: IGrunt) {
	async function buildTask(this: IMultiTask<any>) {
		let cmd = join('node_modules', '.bin', 'webpack');
		if (grunt.option('watch')) {
			cmd += '  --watch';
		}

		const docviewerDir = 'docviewer';
		const proc = exec(cmd, { silent: false, cwd: docviewerDir });

		await promisify(proc);
	}

	grunt.registerMultiTask('docviewer', wrapAsyncTask(buildTask));
};
