import GitHub from '../../util/GitHub';
import Git from '../../util/Git';
import { repositorySource } from '../../util/environment';

/**
 * Resolve the target repository URL using grunt and the state of the environment. Essentially we want to use the
 * ssh+git repository if we think we have credentials and use the https repository otherwise.
 */
export default async function getRepoUrl(options: any, grunt: IGrunt): Promise<string> {
	if (options.url) {
		return options.url;
	}

	const repoOption = grunt.option<string>('repo') || options.repo || repositorySource();
	if (repoOption) {
		const [ owner, name ] = repoOption.split('/');
		const repo = new GitHub(owner, name);
		return repo.url;
	}

	console.log('Repository not explicitly defined. Using current git repository url.');
	const git = new Git();
	return await git.getConfig('remote.origin.url');
}
