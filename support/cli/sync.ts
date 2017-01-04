#!/usr/bin/env node
import { distDirectory, ghPagesBranch, gitConfig } from '../common';
import { clone, usetag, pull, getUrl } from '../util/git';
import { existsSync } from 'fs';
import { isRunningOnTravis } from '../util/travis';
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
		return clone(getUrl(), distDirectory, config);
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
