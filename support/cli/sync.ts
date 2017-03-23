#!/usr/bin/env node
import { distDirectory, ghPagesBranch, dojoioRepo } from '../common';
import Git from '../util/git';
import { existsSync } from 'fs';
import GitHub from '../util/GitHub';
import getRepoUrl from '../commands/getRepoUrl';

/*
 * syncs dojo.io gh-pages
 */

async function ensureGhPages(): Promise<any> {
	if (!existsSync(distDirectory)) {
		const repo = new GitHub(dojoioRepo.owner, dojoioRepo.name);

		const git = new Git(distDirectory);
		await git.setConfig('user.name', 'Travis CI');
		await git.setConfig('user.email', 'support@sitepen.com');
		await git.clone(getRepoUrl(repo));
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
