import { repositorySource } from '../../util/environment';

interface Options {
	repo?: string;
}

export interface Slug {
	name: string;
	owner: string;
}

/**
 * A standard way of configuring the target Github repository
 * @return {{name: string, owner: string}}
 */
export default function getGithubSlug(options: Options, grunt: IGrunt): Slug {
	const repoOption = grunt.option<string>('repo') || options.repo || repositorySource();
	if (repoOption) {
		const [ owner, name ] = repoOption.split('/');
		return {
			name,
			owner
		};
	}
}
