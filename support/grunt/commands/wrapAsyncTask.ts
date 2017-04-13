import IMultiTask = grunt.task.IMultiTask;
import { logger } from '../../log';

export default function wrapAsyncTask<T>(task: (this: IMultiTask<T>) => Promise<any>) {
	return function (this: IMultiTask<T>) {
		const done = this.async();
		task.call(this).then(done, function (e: Error) {
			if (e) {
				logger.error(e.message);
			}
			done(false);
		});
	};
}
