import { existsSync } from 'fs';
import GitHub from '../util/GitHub';

export function shouldPublish(keyFile = 'deploy_key') {
	const type = process.env.DEPLOY_DOCS;
	const branch = process.env.TRAVIS_BRANCH;
	const keyfileAvailable = process.env.FORCE_PUBLISH || existsSync(keyFile);

	return type === 'publish' && branch === 'master' && keyfileAvailable;
}

export default function getRepoUrl(github: GitHub, keyFile = 'deploy_key') {
	if (shouldPublish(keyFile)) {
		return github.getSshUrl();
	}

	return github.getHttpsUrl();
}
