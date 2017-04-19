import { join } from 'path';
import { exec, promisify } from '../util/process';
import { readdirSync } from 'fs';
import { lstatSync } from 'fs';
import * as semver from 'semver';
import { readFileSync } from 'fs';
import { EOL } from 'os';
import { writeFileSync } from 'fs';

function generateHexo(siteDirectory: string, configs: string[] = [ '_config.yml' ]) {
	const hexoBin = join('node_modules', '.bin', 'hexo');
	const proc = exec(`${ hexoBin } --config=${ configs.join(',') } generate`, { silent: false, cwd: siteDirectory });
	return promisify(proc);
}

interface DocumentedApi {
	latest: string;
	package: string;
	versions: string[];
}

function buildApiIndex(apiDirectory: string, source: string, target: string) {
	const apis: DocumentedApi[] = readdirSync(apiDirectory).filter(function (file: string) {
		const stat = lstatSync(join(apiDirectory, file));
		return stat.isDirectory() && file.charAt(0) !== '_';
	}).map(function (dir: string) {
		const versions = readdirSync(join(apiDirectory, dir)).sort(semver.compare);

		return {
			latest: versions[0],
			package: dir,
			versions
		};
	});

	let apiTemplate = readFileSync(source).toString('utf-8');
	for (let api of apis) {
		apiTemplate += `[${ api.package }](/api/${ api.package }/${ api.latest })${ EOL }`;
	}
	writeFileSync(target, apiTemplate);
}

export interface Options {
	apiDirectory: string;
	apiTarget: string;
	apiTemplate: string;
	configs: string[];
	siteDirectory: string;
}

export default async function hexo(options: Options) {
	const { apiDirectory, apiTemplate, apiTarget, siteDirectory, configs } = options;
	buildApiIndex(apiDirectory, apiTemplate, apiTarget);
	await generateHexo(siteDirectory, configs);
}
