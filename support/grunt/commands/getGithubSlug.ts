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
export default function getGithubSlug(options?: Options, grunt?: IGrunt): Slug {
	const repoOption = (grunt && grunt.option<string>('repo')) || (options && options.repo) || repositorySource();
	const [ owner, name ] = repoOption ? repoOption.split('/') : [ undefined, undefined ];
	return {
		name,
		owner
	};
}
