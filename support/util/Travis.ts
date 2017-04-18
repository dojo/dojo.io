import request, { Response, RequestOptions } from 'dojo-core/request';
import Task from 'dojo-core/async/Task';

function responseHandler<T>(response: Response<T>): Response<T> {
	const statusCode = response.statusCode;
	if (statusCode < 200 || statusCode >= 300) {
		const message = response.nativeResponse.statusMessage;
		throw new Error(`Travis responded with ${ statusCode }. ${ message }`);
	}
	return response;
}

function getHeaders(token?: string): RequestOptions['headers'] {
	const headers: RequestOptions['headers'] = {
		Accept: 'application/vnd.travis-ci.2+json',
		'Content-type': 'application/json',
		'User-Agent': 'MyClient/1.0.0'
	};
	if (token) {
		headers.Authorization = `token ${ token }`;
	}
	return headers;
}

export default class Travis {
	token: string = null;

	authenticate(githubToken: string): Task<string> {
		return request.post<{ access_token: string }>('https://api.travis-ci.org/auth/github', {
			data: JSON.stringify({
				'github_token': githubToken
			}),
			headers: getHeaders(),
			responseType: 'json'
		}).then(responseHandler)
		.then<string>((response) => {
			const token = response.data.access_token;
			this.token = token;
			return token;
		});
	}

	fetchRepository(slug: string) {
		const endpoint = `https://api.travis-ci.org/repos/${ slug }`;
		return request.get<{ repo: RepositoryData }>(endpoint, {
			headers: getHeaders(this.token),
			responseType: 'json'
		}).then(responseHandler)
		.then((response) => {
			return new Repository(this.token, response.data.repo);
		});
	}
}

interface RepositoryData {
	active: boolean;
	id: number;
	slug: string;
}

export interface EnviornmentVariable {
	id: string;
	name: string;
	value: string;
	'public': boolean;
	repository_id: number;
}

class Repository {
	active: boolean;

	id: number;

	slug: string;

	token: string;

	constructor(token: string, repo: RepositoryData) {
		this.active = !!repo.active;
		this.id = repo.id;
		this.slug = repo.slug;
		this.token = token;
	}

	listEnvironmentVariables(): Task<EnviornmentVariable[]> {
		const endpoint = `https://api.travis-ci.org/settings/env_vars?repository_id=${ this.id }`;
		return request.get<{ env_vars: EnviornmentVariable[] }>(endpoint, {
			headers: getHeaders(this.token),
			responseType: 'json'
		}).then(responseHandler)
		.then(response => response.data.env_vars);
	}

	async setEnvironmentVariables(... variables: Array<{ name: string, value: string, isPublic?: boolean }>) {
		const envvars = await this.listEnvironmentVariables();

		for (let { name, value, isPublic } of variables) {
			const match: EnviornmentVariable = (<any> envvars).find(function (envvar: EnviornmentVariable) {
				return envvar.name === name;
			});

			if (match) {
				await this.updateEnvironmentVariable(match.id, name, value, isPublic);
			}
			else {
				await this.addEnvironmentVariable(name, value, isPublic);
			}
		}
	}

	private addEnvironmentVariable(name: string, value: string, isPublic = false) {
		const endpoint = `https://api.travis-ci.org/settings/env_vars?repository_id=${ this.id }`;
		return request.post<Repository>(endpoint, {
			data: JSON.stringify({
				'env_var': {
					name,
					value,
					'public': isPublic
				}
			}),
			headers: getHeaders(this.token)
		}).then(responseHandler);
	}

	private updateEnvironmentVariable(id: string, name: string, value: string, isPublic = false) {
		const endpoint = `https://api.travis-ci.org/settings/env_vars/${ id }?repository_id=${ this.id }`;
		return request<Repository>(endpoint, {
			data: JSON.stringify({
				'env_var': {
					name,
					value,
					'public': isPublic
				}
			}),
			headers: getHeaders(this.token),
			method: 'patch'
		}).then(responseHandler);
	}
}
