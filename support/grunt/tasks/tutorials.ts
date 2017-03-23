import archiveTutorials from '../../commands/archiveTutorials';
import IMultiTask = grunt.task.IMultiTask;

export = function (grunt: IGrunt) {
	function tutorialsTask(this: IMultiTask<any>) {
		Promise.all(this.files.map((file) => {
			const srcs = file.src;
			const dest = file.dest;

			grunt.file.mkdir(dest);
			return Promise.all(srcs.map(function (src) {
				return archiveTutorials(src, dest);
			}));
		})).then(this.async())
	}

	grunt.registerMultiTask('tutorials', tutorialsTask)
};
