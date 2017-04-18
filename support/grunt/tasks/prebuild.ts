import IMultiTask = grunt.task.IMultiTask;
import wrapAsyncTask from '../commands/wrapAsyncTask';
import decryptDeployKey from '../../commands/decryptDeployKey';
import { logger } from '../../log';

/**
 * Prepares a continuous integration environment for a build
 */
export = function (grunt: IGrunt) {
	async function prebuildTask(this: IMultiTask<any>) {
		const result = await decryptDeployKey();

		if (result) {
			logger.info('Decrypted deploy key');
		}
	}

	grunt.registerTask('prebuild', 'prepares a the ci environment', wrapAsyncTask(prebuildTask));
};
