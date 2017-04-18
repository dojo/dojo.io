import request from 'dojo-core/request';
import { hasGitCredentials } from './environment';
import { readFileSync } from 'fs';
import { Response } from 'dojo-core/request';

export interface Release {
	name: string;
	commit: {
		sha: string;
		url: string;
	};
}

const API_URL = 'https://api.github.com';

export interface Options {
	password?: string;
	username?: string;
}

export interface AuthResponse {
	id: number;
	token: string;
}

function responseHandler<T>(response: Response<T>): Response<T> {
	const statusCode = response.statusCode;
	if (statusCode < 200 || statusCode >= 300) {
		const message = response.nativeResponse.statusMessage;
		throw new Error(`Github responded with ${ statusCode }. ${ message }`);
	}
	return response;
}

export default class GitHub {
	name: string;

	owner: string;

	password: string;

	username: string;

	constructor(owner: string, name: string, options: Options = {}) {
		if (!owner) {
			throw new Error('A repo owner must be specified');
		}
		if (!name) {
			throw new Error('A repo name must be specified');
		}

		this.owner = owner;
		this.name = name;
		this.authenticate(options.username, options.password);
	}

	get url(): string {
		return hasGitCredentials() ? this.getSshUrl() : this.getHttpsUrl();
	}

	async createAuthorizationToken(note: string = '', scopes: string[] = [
		'read:org', 'user:email', 'repo_deployment', 'repo:status', 'public_repo', 'write:repo_hook'
	]) {
		this.assertAuthentication();
		const endpoint = `https://api.github.com/authorizations`;
		return request.post<AuthResponse>(endpoint, {
			auth: `${ this.username }:${ this.password }`,
			data: JSON.stringify({
				scopes,
				note
			}),
			responseType: 'json'
		}).then(responseHandler)
		.then(response => response.data);
	}

	async removeAuthorizationToken(id: string | number) {
		const endpoint = `https://api.github.com/authorizations/${ id }`;
		return request.delete(endpoint, {
			auth: `${ this.username }:${ this.password }`
		}).then(responseHandler);
	}

	async addDeployKey(keyfile: string, title: string, readOnly: boolean = true) {
		this.assertAuthentication();
		const endpoint = `https://api.github.com/repos/${ this.owner }/${ this.name }/keys`;
		const key = readFileSync(keyfile, { encoding: 'utf8' });
		return request.post(endpoint, {
			auth: `${ this.username }:${ this.password }`,
			data: JSON.stringify({
				title,
				key,
				read_only: readOnly
			}),
			responseType: 'json'
		}).then(responseHandler);
	}

	authenticate(username: string, password: string) {
		this.username = username;
		this.password = password;
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

	getHttpsUrl() {
		return `https://github.com/${ this.owner }/${ this.name }.git`;
	}

	getSshUrl() {
		return `git@github.com:${ this.owner }/${ this.name }.git`;
	}

	toString() {
		return `${ this.owner }/${ this.name }`;
	}

	private assertAuthentication() {
		if (!this.username) {
			throw new Error('Username must be provided');
		}
		if (!this.password) {
			throw new Error('Password must be provided');
		}
	}
}
