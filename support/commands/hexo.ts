import { join } from 'path';
import { promiseExec } from 'grunt-dojo2-extras/src/util/process';
import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import getApiPackages, { DocumentedApi, NpmTag } from './getApiPackages';
import { logger } from '../log';

function generateHexo(siteDirectory: string, configs: string[] = [ '_config.yml' ]) {
	const hexoBin = join('node_modules', '.bin', 'hexo');
	return promiseExec(`${ hexoBin } --config=${ configs.join(',') } generate`, { silent: false, cwd: siteDirectory });
}

export function buildApiIndex(apis: DocumentedApi[], source: string): string {
	const template = readFileSync(source);
	const links: string[] = [];

	for (let api of apis) {
		links.push(`[${ api.package }](/api/${ api.package }/${ api.latest })`);
	}
	logger.info(`Generated API index for ${ links.length } APIs`);

	return template + links.join(EOL);
}

export interface Options {
	apiDirectory: string;
	apiTarget: string;
	apiTemplate: string;
	configs: string[];
	npmTags: { [ dir: string ]: NpmTag };
	siteDirectory: string;
}

export default async function hexo(options: Options) {
	const { apiDirectory, apiTemplate, apiTarget, siteDirectory, configs, npmTags } = options;
	const apis = await getApiPackages(apiDirectory, npmTags);

	writeFileSync(apiTarget, buildApiIndex(apis, apiTemplate));
	await generateHexo(siteDirectory, configs);
}
