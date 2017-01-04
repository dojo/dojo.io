#!/usr/bin/env node

import { siteDirectory } from '../common';
import { join } from 'path';
import exec from '../commands/exec';

const hexoBin = join(siteDirectory, 'node_modules', '.bin', 'hexo');

/*
 * Builds the documentation, tutorial, and blog site into static templates
 */

const commands = {
	blog() {
		return exec(`${ hexoBin } --cwd ${ siteDirectory } generate`);
	},

	'default': 'blog'
};

export default commands;
