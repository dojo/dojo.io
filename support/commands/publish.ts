import Git from '../util/Git';
export type PublishMode = 'publish' | 'commit' | 'skip';

export interface Options {
	branch: string;
	publishMode: (() => PublishMode) | PublishMode;
	repo: Git;
	username?: string;
	useremail?: string;
}

async function createCommitMessage(repo: Git): Promise<string> {
	const username = await repo.getConfig('user.name');
	const commit = process.env.TRAVIS_COMMIT;
	let message = `Published by ${ username }`;

	if (commit) {
		message += ` from commit ${ commit }`;
	}

	return message;
}

export default async function publish(options: Options) {
	const publishMode = typeof options.publishMode === 'function' ? options.publishMode() : options.publishMode;
	const { branch, repo } = options;

	if (publishMode !== 'commit' && publishMode !== 'publish') {
		console.log('skipping publish.');
		return;
	}

	if (!(await repo.areFilesChanged())) {
		console.log('No files changed. Skipping publish.');
		return;
	}

	await repo.ensureConfig(options.username, options.useremail);

	// TODO check pre-requisites: cloneDir should exist (from sync); should be on branch (gh-pages);
	await repo.add('--all');
	await repo.commit(await createCommitMessage(repo));

	if (publishMode === 'publish') {
		// TODO
		console.log('publish!', branch);
		// await repo.push(branch);
	}
}
