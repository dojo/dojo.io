import IMultiTask = grunt.task.IMultiTask;
import wrapAsyncTask from '../commands/wrapAsyncTask';
import GitHub from '../../util/GitHub';
import getGithubSlug from '../commands/getGithubSlug';
import setupAutomation from '../../commands/setupAutomation';

interface Options {
	password?: string;
	repoName?: string;
	repoOwner?: string;
	username?: string;
}

export = function (grunt: IGrunt) {
	async function setupTask(this: IMultiTask<any>) {
		const options = this.options<Options>({
			password: grunt.config.get<string>('github.password'),
			username: grunt.config.get<string>('github.username')
		});
		const { name, owner } = getGithubSlug(options, grunt);
		const repo = new GitHub(owner, name, {
			password: options.password,
			username: options.username
		});
		return setupAutomation(repo);
	}

	grunt.registerMultiTask('setupAutomation', wrapAsyncTask(setupTask));
};
