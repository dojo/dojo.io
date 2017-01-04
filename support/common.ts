import { join } from 'path';

/*
 * Common variables shared between modules
 */

export const dojoioRepo = {
	owner: 'SitePen',
	name: 'dojoio'
};

export const gitConfig = Object.freeze({
	name: 'Travis CI',
	email: 'pshannon@sitepen.com'
});

export const dojoProjectOwner = 'dojo';

export const ghPagesBranch = 'gh-pages';

export const rootDirectory = join(__dirname, '..');

export const binDirectory = join(rootDirectory, 'node_modules', '.bin');

export const distDirectory = join(rootDirectory, '_dist');

export const siteDirectory = join(rootDirectory, 'site');

export const apiDirectory = join(distDirectory, 'api');

export const tempDirectory = join(rootDirectory, '.apitemp');

export const publishDirectory = '.ghpublish';
