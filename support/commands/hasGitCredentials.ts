import { existsSync } from 'fs';

/**
 * If running on Travis then explicit git credentials are required to perform certain git actions (e.g. push)
 */
export default function hasGitCredentials(keyFile = 'deploy_key'): boolean {
	const type = process.env.DEPLOY_DOCS;
	const branch = process.env.TRAVIS_BRANCH;

	const isRunningOnCI = !!branch || !process.env.FORCE_PUBLISH;
	const hasDeployCredentials = type === 'publish' && branch === 'master' && existsSync(keyFile);

	return !isRunningOnCI || hasDeployCredentials;
}
