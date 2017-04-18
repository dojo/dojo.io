import IMultiTask = grunt.task.IMultiTask;
import publish from '../../commands/publish';
import Git from '../../util/Git';
import wrapAsyncTask from '../commands/wrapAsyncTask';
import { hasGitCredentials, publishMode } from '../../util/environment';

export = function (grunt: IGrunt) {
	async function publishTask(this: IMultiTask<any>) {
		const options = this.options<any>({
			publishMode() {
				if (hasGitCredentials()) {
					return publishMode();
				}

				return 'skip';
			}
		});

		const publishModeCli = grunt.option<string>('publishmode');
		if (publishModeCli) {
			options.publishMode = publishModeCli;
		}
		options.repo = new Git(options.cloneDirectory);

		await publish(options);
	}

	grunt.registerMultiTask('publish', wrapAsyncTask(publishTask));
};
