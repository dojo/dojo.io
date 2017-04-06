import LogModule = grunt.log.LogModule;
import { ChildProcess } from 'child_process';
import { promisify } from '../../util/process';

export default function wrapProcess(proc: ChildProcess, log: LogModule, done?: () => void) {
	proc.stderr.on('data', function (buffer) {
		log.error(buffer.toString());
	});
	proc.stdout.on('data', function (buffer) {
		log.write(buffer.toString());
	});

	const promise = promisify(proc);

	if (done) {
		promise.then(done, done);
	}

	return promise;
}
