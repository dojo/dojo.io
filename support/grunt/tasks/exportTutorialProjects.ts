import exportTutorialProjects from '../../commands/exportTutorialProjects';
import IMultiTask = grunt.task.IMultiTask;
import wrapAsyncTask from 'grunt-dojo2-extras/tasks/util/wrapAsyncTask';

export = function (grunt: IGrunt) {
	function exportTutorialProjectsTask(this: IMultiTask<any>) {
		return Promise.all(this.files.map((file) => {
			const srcs = file.src;
			const dest = file.dest;

			grunt.file.mkdir(dest);
			return Promise.all(srcs.map(function (src) {
				return exportTutorialProjects(src, dest);
			}));
		}));
	}

	grunt.registerMultiTask('exportTutorialProjects', wrapAsyncTask(exportTutorialProjectsTask));
};
