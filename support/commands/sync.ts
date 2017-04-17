import Git from '../util/Git';
import { logger } from '../log';

export interface Options {
	branch: string;
	cloneDirectory: string;
	url: string;
	username?: string;
	useremail?: string;
}

export default async function sync(options: Options) {
	const { branch, cloneDirectory, url } = options;
	const git = new Git(cloneDirectory);

	logger.info(`Syncing ${ url } to ${ cloneDirectory }`);
	await git.ensureConfig(options.username, options.useremail);
	// TODO if branch doesn't exist create an orphan
	await git.clone(url);
	await git.checkout(branch);
	await git.pull();
}
