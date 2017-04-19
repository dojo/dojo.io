import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';
import * as semver from 'semver';

export interface DocumentedApi {
	format: 'html' | 'json';
	latest: string;
	package: string;
	versions: string[];
}

/**
 * Provides information on installed API packages
 * @param apiDirectory the directory where packages reside
 */
export default function getApiPackages(apiDirectory: string): DocumentedApi[] {
	return readdirSync(apiDirectory).filter(function (file: string) {
		const stat = lstatSync(join(apiDirectory, file));
		return stat.isDirectory() && file.charAt(0) !== '_';
	}).map(function (dir: string) {
		const versions = readdirSync(join(apiDirectory, dir))
			.filter(dir => { return semver.clean(dir); })
			.sort(semver.compare);
		const latest = versions.length ? versions[versions.length - 1] : null;

		return <DocumentedApi> {
			format: 'html',
			latest,
			package: dir,
			versions
		};
	});
}
