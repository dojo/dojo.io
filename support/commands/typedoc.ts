import GitHub, { Release } from '../util/GitHub';
import { join, basename, dirname } from 'path';
import { existsSync } from 'fs';
import hasGitCredentials from './hasGitCredentials';
import Git from '../util/Git';
import { promiseExec as exec } from '../util/process';
import * as shell from 'shelljs';
import * as semver from 'semver';

export interface Options {
	apiThemeDirectory: string;
	buildDirectory: string;
	filter?: string | ((version: Release) => boolean);
	format: 'html' | 'json';
	owner: string;
	repoName: string;
	target: string;
}

export interface ReleaseFilter {
	(release: Release): boolean;
}

function noopFilter() {
	return true;
}

async function filterReleases(releases: Release[], baseDirectory: string, filter: ReleaseFilter | string = noopFilter) {
	// Ensure a sorted list
	releases = releases.sort(function (a: Release, b: Release) {
		return semver.compare(a.name, b.name);
	});

	let filterMethod: ReleaseFilter = noopFilter;
	if (filter === 'latest') {
		releases = releases.slice(-1);
	}
	else if (typeof filter === 'string') {
		filterMethod = function (release: Release) {
			const version = semver.clean(release.name);
			return semver.satisfies(version, filter);
		};
	}

	return releases.filter(function (release: Release) {
		const path = join(baseDirectory, release.name);

		return filterMethod(release) && !existsSync(path);
	});
}

export default async function typedoc(options: Options) {
	const { target, apiThemeDirectory, buildDirectory, format, owner, repoName } = options;
	const repo = new GitHub(owner, repoName);
	const releases = await repo.fetchReleases();
	const targetDir = join(dirname(target), repo.name);
	const missingReleases = await filterReleases(releases, targetDir, options.filter);

	if (missingReleases.length) {
		const versions = missingReleases.map(release => release.name).join(', ');
		console.log(`Preparing to build API documentation for ${ repo.toString() } versions: ${ versions }`);
	}
	else {
		console.log(`API documentation for ${ repo.toString() } is up to date`);
	}

	for (let release of missingReleases) {
		const version = release.name;
		const repoDir = join(buildDirectory, repo.name, version, 'src');
		const packageTargetDir = join(targetDir, version);
		console.log(`building api docs for ${ repo.owner }/${ repo.name }@${ version }`);

		// Ensure we have a copy of the repository we want to make API docs from
		if (!existsSync(repoDir)) {
			const url = hasGitCredentials() ? repo.getSshUrl() : repo.getHttpsUrl();
			const git = new Git(repoDir);
			await git.ensureConfig();
			await git.clone(url);
			await git.checkout(version);
		}

		// install any dependencies to the package
		console.log('Installing dependencies');
		const typingsJson = join(repoDir, 'typings.json');
		await exec('npm install', { silent: false, cwd: repoDir });

		if (existsSync(typingsJson)) {
			await exec('typings install', { silent: false, cwd: repoDir });
		}

		// build docs
		console.log('Building API Documentation');
		shell.mkdir('-p', packageTargetDir);
		const typedocBin = require.resolve('typedoc/bin/typedoc');
		let outputOption: string;
		if (format === 'json') {
			const targetFile = basename(target) || 'api.json';
			outputOption = `--json ${ join(packageTargetDir, targetFile) }`;
		}
		else {
			outputOption = `--out ${ packageTargetDir } --theme ${ apiThemeDirectory }`;
		}
		const command = `${ typedocBin } --mode file ${ repoDir } ${ outputOption } --externalPattern '**/+(example|examples|node_modules|tests|typings)/**/*.ts' --excludeExternals --excludeNotExported --ignoreCompilerErrors`;
		await exec(command);
	}
}
