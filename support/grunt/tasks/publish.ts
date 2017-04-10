import IMultiTask = grunt.task.IMultiTask;
import publish from '../../commands/publish';
import Git from '../../util/Git';
import wrapAsyncTask from '../commands/wrapAsyncTask';

export = function (grunt: IGrunt) {
	async function publishTask(this: IMultiTask<any>) {
		const options = this.options<any>({
			publishMode: 'skip'
		});
		options.repo = new Git(options.cloneDirectory);

		await publish(options);
	}

	grunt.registerMultiTask('publish', wrapAsyncTask(publishTask));
};
