import { join } from 'path';
import { exec, promisify } from '../util/process';
import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import getApiPackages, { DocumentedApi } from './getApiPackages';

function generateHexo(siteDirectory: string, configs: string[] = [ '_config.yml' ]) {
	const hexoBin = join('node_modules', '.bin', 'hexo');
	const proc = exec(`${ hexoBin } --config=${ configs.join(',') } generate`, { silent: false, cwd: siteDirectory });
	console.log(`${ hexoBin } --config=${ configs.join(',') } generate`);
	return promisify(proc);
}

export function buildApiIndex(apis: DocumentedApi[], source: string): string {
	const template = readFileSync(source);
	const links: string[] = [];

	for (let api of apis) {
		links.push(`[${ api.package }](/api/${ api.package }/${ api.latest })`);
	}

	return template + links.join(EOL);
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
	const apis = getApiPackages(apiDirectory);

	writeFileSync(apiTarget, buildApiIndex(apis, apiTemplate));
	await generateHexo(siteDirectory, configs);
}
