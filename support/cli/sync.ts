#!/usr/bin/env node
import { distDirectory, ghPagesBranch, repoOwner, repoName } from '../common';
import Git from '../util/git';
import { existsSync } from 'fs';
import GitHub from '../util/GitHub';
import hasGitCredentials from '../commands/hasGitCredentials';

/*
 * syncs dojo.io gh-pages
 */

async function ensureGhPages(): Promise<any> {
	if (!existsSync(distDirectory)) {
		const repo = new GitHub(repoOwner, repoName);
		const url = hasGitCredentials() ? repo.getSshUrl() : repo.getHttpsUrl();

		const git = new Git(distDirectory);
		await git.setConfig('user.name', 'Travis CI');
		await git.setConfig('user.email', 'support@sitepen.com');
		await git.clone(url);
	}
}

const commands = {
	async ghpages() {
		const git = new Git(distDirectory);

		await ensureGhPages();
		await git.checkout(ghPagesBranch);
		await git.pull();
	},

	'default': 'ghpages'
};

export default commands;
