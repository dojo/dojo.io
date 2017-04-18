import IMultiTask = grunt.task.IMultiTask;
import sync, { Options as SyncOptions } from '../../commands/sync';
import wrapAsyncTask from '../commands/wrapAsyncTask';
import Git from '../../util/Git';
import GitHub from '../../util/GitHub';
import { repositorySource } from '../../util/environment';

/**
 * Resolve the target repository URL using grunt and the state of the environment. Essentially we want to use the
 * ssh+git repository if we think we have credentials and use the https repository otherwise.
 */
async function getRepoUrl(options: Options, grunt: IGrunt): Promise<string> {
	if (options.url) {
		return options.url;
	}

	const repoOption = grunt.option<string>('repo') || options.repo || repositorySource();
	if (repoOption) {
		const [ owner, name ] = repoOption.split('/');
		const repo = new GitHub(owner, name);
		return repo.url;
	}

	console.log('Repository not explicitly defined. Using current git repository url.');
	const git = new Git();
	return await git.getConfig('remote.origin.url');
}

interface Options {
	url?: string;
	repo?: string;
}

export = function (grunt: IGrunt) {
	async function syncTask(this: IMultiTask<any>) {
		const options = this.options<Options>({});
		options.url = await getRepoUrl(options, grunt);
		await sync(<SyncOptions> options);
	}

	grunt.registerMultiTask('sync', wrapAsyncTask(syncTask));
};
