import IMultiTask = grunt.task.IMultiTask;
import publish from '../../commands/publish';
import Git from '../../util/Git';

export = function (grunt: IGrunt) {
	function publishTask(this: IMultiTask<any>) {
		const done = this.async();
		const options = this.options<any>({
			publishMode: 'skip'
		});
		options.repo = new Git(options.cloneDirectory);

		publish(options)
			.then(done)
	}

	grunt.registerMultiTask('publish', publishTask)
};
