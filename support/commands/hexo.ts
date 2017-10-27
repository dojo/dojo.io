import { join } from 'path';
import { exec, promisify } from 'grunt-dojo2-extras/src/util/process';

function generateHexo(siteDirectory: string, configs: string[] = [ '_config.yml' ]) {
	const hexoBin = join('node_modules', '.bin', 'hexo');
	const proc = exec(`${ hexoBin } --config=${ configs.join(',') } generate`, { silent: false, cwd: siteDirectory });
	return promisify(proc);
}

export interface Options {
	configs: string[];
	siteDirectory: string;
}

export async function hexo(options: Options) {
	const { siteDirectory, configs } = options;
	await generateHexo(siteDirectory, configs);
}

export async function hexoClean(targetDirectory: string) {
	const hexoBin = join('node_modules', '.bin', 'hexo');
	const proc = exec(`${ hexoBin } clean`, { silent: false, cwd: targetDirectory });
	await promisify(proc);
}
