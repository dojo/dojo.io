/*
 * Build API documentation from a dojo 2 project
 */
import exec from '../commands/exec';
import request from 'dojo-core/request';
import { apiDirectory, tempDirectory, dojoProjectOwner } from '../common';
import { existsSync } from 'fs';
import { join as joinPath } from 'path';
import { getUrl, clone, usetag } from '../util/git';
const shell = require('shelljs');

interface Release {
	name: string;
	commit: {
		sha: string;
		url: string;
	}
}

const repos = Object.freeze([
	// 'actions',
	// 'app',
	// 'cli',
	'compose',
	'core',
	// 'dataviz',
	// 'dom',
	'has',
	'interfaces',
	// 'i18n',
	'loader',
	// 'routing',
	'shim',
	// 'stores',
	'streams'
	// 'widgets'
]);

function fetchReleases(): Promise<Release[]> {
	const url = `${ getUrl() }/tags`;

	return <any> request<Buffer>(url)
		.then<Release[]>(function (response) {
			if (response.statusCode >= 200 && response.statusCode < 300) {
				const releases: Release[] = JSON.parse(response.data.toString());
				return releases;
			}
			else {
				throw new Error(`${ response.statusCode } ${ response.nativeResponse.statusMessage }`);
			}
		});
}

function fetchMissing(repo: string): Promise<Release[]> {
	return fetchReleases()
		.then(function (releases) {
			return releases.filter(function (release: Release) {
				return !existsSync(joinPath(apiDirectory, repo, release.name))
			});
		});
}

function fetchTag(repo: string, version: string) {
	const repoDir = joinPath(tempDirectory, repo, version);

	shell.mkdir('-p', repoDir);
	shell.rm('-rf', repoDir);
	return clone(getUrl(), repoDir)
		.then(function () {
			shell.cd(repoDir);
			return usetag(version);
		})
}

function buildDocs(owner: string, repo: string, version: string) {
	// TODO add support for npm install and typings install?

	const repoDir = joinPath(tempDirectory, repo, version);
	console.log(`building api docs for ${ owner }/${ repo }@${ version }`);
	return fetchTag(repo, version)
		.then(function () {
			const targetDir = joinPath(apiDirectory, repo, version);
			const command = `typedoc --mode modules ${ repoDir }/src/ --out ${ targetDir } --excludeNotExported --ignoreCompilerErrors`;
			shell.mkdir('-p', targetDir);
			return exec(command);
		});
}

const commands = {
	list() {
		// a list of repos which APIs should be generated
		console.log(repos.join('\n'));
	},

	releases(owner: string, repo: string) {
		if (!owner) {
			return Promise.reject(new Error('A repo owner must be specified'));
		}
		if (!repo) {
			return Promise.reject(new Error('A repo must be specified'));
		}

		return fetchReleases()
			.then(function (releases: Release[]): Release[] {
				for (let release of releases) {
					console.log(release.name);
				}
				return releases;
			});
	},

	missing(owner: string, repo: string) {
		// list releases where apis are missing

		return fetchMissing(repo)
			.then(function (releases: Release[]): Release[] {
				for (let release of releases) {
					console.log(release.name);
				}
				return releases;
			});
	},

	build(owner: string, repo: string, version: string) {
		return buildDocs(owner, repo, version);
	},

	createIndex(_project: string) {
		// TODO generate an index.html landing page listing available versions
		// e.g. /api/core/index.html
	},

	async all() {
		// TODO blacklist apis older than a certain age/version (maybe based on typings)
		const owner = dojoProjectOwner;
		for (let repo of repos) {
			console.log(owner, repo);
			const releases: Release[] = await fetchMissing(repo);

			for (let release of releases) {
				await buildDocs(owner, repo, release.name);
			}
		}
	}
};

export default commands;
