import IMultiTask = grunt.task.IMultiTask;

export default function wrapAsyncTask<T>(task: (this: IMultiTask<T>) => Promise<any>, grunt?: IGrunt) {
	return function (this: IMultiTask<T>) {
		const done = this.async();
		task.call(this).then(done, function (e: Error) {
			if (grunt && e) {
				grunt.log.error(e.message);
			}
			done();
		});
	};
}
