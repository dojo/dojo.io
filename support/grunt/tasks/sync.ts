import IMultiTask = grunt.task.IMultiTask;
import sync, { Options as SyncOptions } from '../../commands/sync';
import getRepoUrl from '../commands/getRepoUrl';
import wrapAsyncTask from '../commands/wrapAsyncTask';

export = function (grunt: IGrunt) {
	async function syncTask(this: IMultiTask<any>) {
		const options = this.options<any>({});
		options.url = await getRepoUrl(options, grunt);
		await sync(<SyncOptions> options);
	}

	grunt.registerMultiTask('sync', wrapAsyncTask(syncTask));
};
