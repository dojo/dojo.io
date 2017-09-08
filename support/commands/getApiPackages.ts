import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';
import * as semver from 'semver';
import { exec } from 'grunt-dojo2-extras/src/util/process';
import { toString } from 'grunt-dojo2-extras/src/util/streams';

export interface DocumentedApi {
	format: 'html' | 'json';
	latest: string;
	package: string;
	versions: string[];
}

export interface NpmTag {
	scope: string;
	tag: string;
}

/**
 * Provides information on installed API packages
 * @param apiDirectory the directory where packages reside
 * @param npmTags Optional NPM tags to use to determine the appropriate version to display
 */
export default async function getApiPackages(apiDirectory: string, npmTags: { [ dir: string ]: NpmTag } = {}): Promise<DocumentedApi[]> {
	async function getDocumentedApi(dir: string) {
		const versions = readdirSync(join(apiDirectory, dir))
			.filter(dir => { return semver.clean(dir); })
			.sort(semver.compare);

		let latest: string | null = versions.length ? versions[versions.length - 1] : null;
		if (npmTags[dir]) {
			const { scope, tag } = npmTags[dir];
			const proc = exec(`npm view ${scope}/${dir}@${tag} version`, { silent: true });
			const tagVersion = (await toString(proc.stdout)).trim();
			for (let version of versions) {
				if (semver.eq(version, tagVersion)) {
					latest = version;
				}
			}
		}

		return {
			format: 'html',
			latest,
			package: dir,
			versions
		} as DocumentedApi;
	}

	return Promise.all(readdirSync(apiDirectory).filter(function (file: string) {
		const stat = lstatSync(join(apiDirectory, file));
		return stat.isDirectory() && file.charAt(0) !== '_';
	}).map(getDocumentedApi));
}
