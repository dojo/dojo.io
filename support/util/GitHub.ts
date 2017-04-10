import request from 'dojo-core/request';
import { hasGitCredentials } from './environment';

export interface Release {
	name: string;
	commit: {
		sha: string;
		url: string;
	};
}

const API_URL = 'https://api.github.com';

export default class GitHub {
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

	get url(): string {
		return hasGitCredentials() ? this.getSshUrl() : this.getHttpsUrl();
	}

	getHttpsUrl() {
		return `https://github.com/${ this.owner }/${ this.name }.git`;
	}

	getSshUrl() {
		return `git@github.com:${ this.owner }/${ this.name }.git`;
	}

	toString() {
		return `${ this.owner }/${ this.name }`;
	}
}
