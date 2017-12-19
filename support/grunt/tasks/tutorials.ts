import archiveTutorials from '../../commands/archiveTutorials';
import verifyTutorials from '../../commands/verifyTutorials';

import IMultiTask = grunt.task.IMultiTask;
import wrapAsyncTask from 'grunt-dojo2-extras/tasks/util/wrapAsyncTask';

export = function (grunt: IGrunt) {
	function archiveTutorialsTask(this: IMultiTask<any>) {
		return Promise.all(this.files.map((file) => {
			const { src: srcs, dest} = file;

			grunt.file.mkdir(dest);
			return Promise.all(srcs.map(function (src) {
				return archiveTutorials(src, dest);
			}));
		}));
	}

	function verifyTutorialsTask(this: IMultiTask<any>) {
		const { updateHashes } = this.options({
			updateHashes: true
		});
		return Promise.all(this.files.map((file) => {
			const { src } = file;
			return Promise.all(src.map((s) => {
				return verifyTutorials(s, updateHashes);
			}));
		}));
	}

	grunt.registerMultiTask('archiveTutorials', wrapAsyncTask(archiveTutorialsTask));
	grunt.registerMultiTask('verifyTutorials', wrapAsyncTask(verifyTutorialsTask));
};
