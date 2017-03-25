/*
 * Build API documentation from a dojo 2 project
 */
import exec from '../commands/exec';
import { apiDirectory, tempDirectory, dojoProjectOwner, repos, apiThemeDirectory } from '../common';
import { join as joinPath } from 'path';
import { existsSync } from 'fs';
import Git from '../util/git';
import GitHub, { Release } from '../util/GitHub';
import getRepoUrl from '../commands/getRepoUrl';
const shell = require('shelljs');

/**
 * @return {Promise<Release[]>} a list of releases not present in the rootDir
 */
async function fetchMissing(repo: GitHub): Promise<Release[]> {
	const releases = await repo.fetchReleases();

	return releases.filter(function (release: Release) {
		const path = joinPath(apiDirectory, repo.name, release.name);
		return !existsSync(path);
	});
}

async function buildDocs(repo: GitHub, version: string) {
	// TODO add support for npm install and typings install?

	console.log(`building api docs for ${ repo.owner }/${ repo.name }@${ version }`);

	const repoDir = joinPath(tempDirectory, repo.name, version, 'src');
	const targetDir = joinPath(apiDirectory, repo.name, version);

	if(!existsSync(repoDir)){
		const git = new Git(repoDir);
		await git.ensureConfig();
		await git.clone(getRepoUrl(repo));
		await git.checkout(version);
	}
	const typingsJson = joinPath(repoDir, 'typings.json');
	shell.cd(repoDir);
	await exec('npm install');

	if (existsSync(typingsJson)) {
		await exec('typings install');
	}
	

	// TODO use grunt doc when typedoc is released w/ TS 2.2.1 support
	// await exec('grunt doc');
	shell.mkdir('-p', targetDir);
	const typedocBin = require.resolve('typedoc/bin/typedoc');
	const command = `${ typedocBin } --mode modules ${repoDir} --out ${targetDir} --theme ${apiThemeDirectory} --externalPattern '**/+(example|examples|node_modules|tests|typings)/**/*.ts' --excludeExternals --excludeNotExported --ignoreCompilerErrors`;
	return exec(command);
}

const commands = {
	list() {
		// a list of repos which APIs should be generated
		console.log(repos.join('\n'));
	},

	async releases(owner: string, repoName: string) {
		const repo = new GitHub(owner, repoName);
		const releases = await repo.fetchReleases();
		for (let release of releases) {
			console.log(release.name);
		}
	},

	async missing(owner: string, repoName: string) {
		const repo = new GitHub(owner, repoName);
		const missing = await fetchMissing(repo);
		for (let release of missing) {
			console.log(release.name);
		}
		return missing;
	},

	async build(owner: string, repoName: string, version: string) {
		const repo = new GitHub(owner, repoName);
		await buildDocs(repo, version);
	},

	createIndex(_project: string) {
		// TODO generate an index.html landing page listing available versions
		// e.g. /api/core/index.html
	},

	async all() {
		// TODO blacklist apis older than a certain age/version (maybe based on typings)
		const owner = dojoProjectOwner;
		for (let repoName of repos) {
			const repo = new GitHub(owner, repoName);
			const releases: Release[] = await fetchMissing(repo);

			for (let release of releases) {
				await buildDocs(repo, release.name);
			}
		}
	}
};

export default commands;
