#!/usr/bin/env node
import { distDirectory, ghPagesBranch, gitConfig, dojoioRepo } from '../common';
import { clone, usetag, pull } from '../util/git';
import { existsSync } from 'fs';
import { isRunningOnTravis } from '../util/travis';
import GitHub from '../util/GitHub';
const shell = require('shelljs');

/*
 * syncs dojo.io gh-pages
 */

function ensureGhPages(): Promise<any> {
	if (existsSync(distDirectory)) {
		return Promise.resolve();
	}
	else {
		const config = isRunningOnTravis() ? gitConfig : null;
		const repo = new GitHub(dojoioRepo.owner, dojoioRepo.name);

		return clone(repo.getCloneUrl(), distDirectory, config);
	}
}

const commands = {
	ghpages() {
		return ensureGhPages()
			.then(function () {
				shell.cd(distDirectory);
				return usetag(ghPagesBranch);
			})
			.then(function () {
				return pull();
			})
	},

	'default': 'ghpages'
};

export default commands;
