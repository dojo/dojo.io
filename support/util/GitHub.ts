import request from 'dojo-core/request';

export interface Release {
	name: string;
	commit: {
		sha: string;
		url: string;
	};
}

const API_URL = 'https://api.github.com';

export default class {
	owner: string;

	name: string;

	constructor(owner: string, name: string) {
		if (!owner) {
			throw new Error('A repo owner must be specified');
		}
		if (!name) {
			throw new Error('A repo name must be specified');
		}

		this.owner = owner;
		this.name = name;
	}

	/**
	 * @return {Promise<Release[]>} a list of releases
	 */
	async fetchReleases(): Promise<Release[]> {
		const url = `${ API_URL }/repos/${ this.owner }/${ this.name }/tags`;

		const response = await request<Buffer>(url);

		if (response.statusCode >= 200 && response.statusCode < 300) {
			return JSON.parse(response.data.toString());
		}
		else {
			throw new Error(`${ response.statusCode } ${ response.nativeResponse.statusMessage }`);
		}
	}

	getCloneUrl() {
		return `git@github.com:${ this.owner }/${ this.name }.git`;
	}
}
