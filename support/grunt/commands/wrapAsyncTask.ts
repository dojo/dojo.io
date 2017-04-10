import IMultiTask = grunt.task.IMultiTask;

export default function wrapAsyncTask<T>(task: (this: IMultiTask<T>) => Promise<any>) {
	return function (this: IMultiTask<T>) {
		const done = this.async();
		task.call(this).then(done, done);
	};
}
