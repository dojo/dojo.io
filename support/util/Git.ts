import shellExec from '../commands/exec';
import { promiseExec, promiseSpawn, exec } from './process';
import { existsSync, chmodSync } from 'fs';
import { join as joinPath, relative } from 'path';
import { ChildProcess } from 'child_process';
import { toString } from './buffer';
const shell = require('shelljs');

export function config(key: string): Promise<string> {
	return shellExec(`git config ${ key }`, false)
		.then(useStdout);
}

export function currentBranch() {
	return shellExec(`git rev-parse --abbrev-ref HEAD`, false)
		.then(useStdout);
}

export async function ensureGitRepo(path: string, repoUrl: string) {
	const url = await getRemoteUrl();
	shell.cd(path);

	if (!existsSync(joinPath(path, '.git'))) {
		throw new Error('Not a git repository');
	}

	if (url !== repoUrl) {
		throw new Error(`expected repo url of ${ repoUrl }. Instead got ${ url }`);
	}
}

export function getRemoteUrl() {
	return shellExec(`git config --get remote.origin.url`, false)
		.then(useStdout);
}

export function headRevision() {
	return shellExec(`git rev-parse HEAD`, false)
		.then(useStdout);
}

function useStdout(result: { stdout: string }) {
	return result.stdout.trim();
}

export default class Git {
	cloneDirectory: string | null;

	keyFile?: string;

	url?: string;

	constructor(cloneDirectory: string = process.cwd(), keyFile: string = 'deploy_key') {
		this.cloneDirectory = cloneDirectory;
		this.keyFile = keyFile;
	}

	async add(... params: string[]): Promise<any> {
		return promiseExec(`git add ${ params.join(' ') }`, { silent: false, cwd: this.cloneDirectory});
	}

	checkout(version: string) {
		return promiseExec(`git checkout ${ version }`, { silent: false, cwd: this.cloneDirectory});
	}

	async clone(url: string) {
		if (!this.cloneDirectory) {
			throw new Error('A clone directory must be set');
		}
		console.log(`Cloning ${ url } to ${ this.cloneDirectory }`);
		if (existsSync(this.cloneDirectory)) {
			console.log(`Repository exists at ${ this.cloneDirectory }`);
			const repoUrl = await this.getConfig('remote.origin.url');
			if (repoUrl !== url) {
				throw new Error(`Repository mismatch. Expected "${ repoUrl }" to be "${ url }".`);
			}
		}
		await this.execSSHAgent('git', [ 'clone', url, this.cloneDirectory ], { silent: false });
		this.url = url;
	}

	async commit(message: string): Promise<any> {
		return this.execSSHAgent('git', ['commit', '-m', `"${ message }"`], { silent: false, cwd: this.cloneDirectory });
	}

	async createOrphan(branch: string) {
		if (!this.cloneDirectory) {
			throw new Error('A clone directory must be set');
		}
		await promiseExec(`git checkout --orphan ${ branch }`, { silent: true, cwd: this.cloneDirectory });
		await promiseExec('git rm -rf .', { silent: true, cwd: this.cloneDirectory });
		console.log(`Created "${ branch }" branch`);
	}

	/**
	 * Ensures configuration required by GitHub exists
	 * @param user a fallback user name if one does not exist
	 * @param email a fallback email if one does not exist
	 */
	ensureConfig(user: string = 'Travis CI', email: string = 'support@sitepen.com'): Promise<any> {
		return Promise.all([
			this.hasConfig('user.name').then((result) => {
				if (!result) {
					return this.setConfig('user.name', user);
				}
			}),
			this.hasConfig('user.email').then((result) => {
				if (!result) {
					return this.setConfig('user.email', email);
				}
			})
		]);
	}

	/**
	 * Execute a credentialed git command
	 */
	execSSHAgent(command: string, args: string[], options: any = {}): Promise<ChildProcess> {
		if (this.hasDeployCredentials()) {
			const deployKey: string = <string> this.keyFile;
			const relativeDeployKey = options.cwd ? relative(options.cwd, deployKey) : deployKey;
			chmodSync(deployKey, '600');
			return promiseExec(`ssh-agent bash -c 'ssh-add ${ relativeDeployKey }; ${ command } ${ args.join(' ') }'`, options);
		}
		else {
			console.log(`Deploy Key "${ this.keyFile }" is not present. Using environment credentials for ${ args[0] }.`);
			return promiseSpawn(command, args, options);
		}
	}

	async getConfig(key: string): Promise<string> {
		const proc = await exec(`git config ${ key }`, { cwd: this.cloneDirectory });
		return (await toString(proc.stdout)).trim();
	}

	async areFilesChanged(): Promise<boolean> {
		const result: ChildProcess = await promiseExec('git status --porcelain', { silent: true, cwd: this.cloneDirectory });
		return result.stdout.toString() !== '';
	}

	async hasConfig(key: string): Promise<boolean> {
		const value = await this.getConfig(key);
		return !!value;
	}

	/**
	 * @return {boolean} if a deploy key exists in the file system
	 */
	hasDeployCredentials(): boolean {
		return existsSync(this.keyFile);
	}

	pull() {
		return this.execSSHAgent('git', ['pull'], {
			cwd: this.cloneDirectory
		});
	}

	push(branch?: string, remote: string = 'origin') {
		const params: string[] = branch ? [ 'push', remote, branch ] : [ 'push' ];
		return this.execSSHAgent('git', params, { silent: true, cwd: this.cloneDirectory });
	}

	setConfig(key: string, value: string) {
		// TODO make global optional
		return promiseExec(`git config --global ${ key } ${ value }`, { silent: true });
	}
}
