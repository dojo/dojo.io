#!/usr/bin/env node
import { distDirectory, publishDirectory, rootDirectory, gitConfig, masterBranch, dojoioRepo } from '../common';
import { config, headRevision, ensureGitRepo } from '../util/git';
import GitHub from '../util/GitHub';
import { decryptDeployKey, isBranch } from '../util/travis';
const ghpages = require('gh-pages');
const shell = require('shelljs');

/*
 * Publish the distribution to GitHub Pages
 */

function shouldPush(args: string[]) {
	for (let arg of args) {
		if (arg === '--push' || arg === '--push=true') {
			return true;
		}
	}

	return isBranch(masterBranch) && decryptDeployKey();
}

function buildOptions() {
	return {
		clone: publishDirectory,
		logger: function(message: string) {
			console.log(message);
		}
	};
}

function publish(options: any) {
	if (!options.push) {
		console.log('Skipping publish to repo.');
		return;
	}
	const repo = new GitHub(dojoioRepo.owner, dojoioRepo.name);

	return ensureGitRepo(distDirectory, repo.getSshUrl())
		.then(function () {
			return new Promise(function (resolve, reject) {
				shell.cd(rootDirectory);
				ghpages.publish(distDirectory, options, function (err: any) {
					if (err) {
						reject(err);
					}
					else {
						resolve();
					}
				});
			});
		});
}

const commands = {
	ci(... args: string[]) {
		const options: any = buildOptions();
		const push = shouldPush(args);

		options.user = gitConfig;
		options.push = push;
		options.message = `Built by Travis for commit ${ process.env.TRAVIS_COMMIT }`;

		return publish(options);
	},

	manual(... args: string[]) {
		const options: any = buildOptions();
		const push = shouldPush(args);

		return Promise.all([
			config('user.name'),
			headRevision()
		]).then(function (result: [string, string]) {
			const [user, currentCommit] = result;

			options.push = push;
			options.message = `Built manually by ${ user } for commit ${ currentCommit }`;

			return publish(options);
		});
	},

	'default': 'ci'
};

export default commands;
