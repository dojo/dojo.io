import IMultiTask = grunt.task.IMultiTask;
import sync, { Options as SyncOptions } from '../../commands/sync';
import getRepoUrl from '../commands/getRepoUrl';

export = function (grunt: IGrunt) {
	async function syncTask(this: IMultiTask<any>) {
		const done = this.async();
		const options = this.options<any>({});
		options.url = await getRepoUrl(options, grunt);

		await sync(<SyncOptions> options);
		done();
	}

	grunt.registerMultiTask('sync', syncTask)
};
