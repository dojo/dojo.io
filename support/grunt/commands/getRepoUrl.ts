import GitHub from '../../util/GitHub';
import getUrlFromEnvironment from '../../commands/getRepoUrl';
import Git from '../../util/Git';

/**
 * Resolve the target repository URL using grunt and the state of the environment. Essentially we want to use the
 * ssh+git repository if we think we have credentials and use the https repository otherwise.
 */
export default async function getRepoUrl(options: any, grunt: IGrunt) {
	if (options.url) {
		return options.url;
	}

	const repo = grunt.option<string>('repo') || options.repo || process.env.TRAVIS_SLUG;
	if (repo) {
		const [ owner, name ] = repo.split('/');
		const gh = new GitHub(owner, name);
		return getUrlFromEnvironment(gh);
	}
	else {
		const git = new Git(process.cwd());
		options.url = await git.getConfig('remote.origin.url');
	}
}
