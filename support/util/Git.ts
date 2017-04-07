import shellExec from '../commands/exec';
import { promiseExec as exec, promiseSpawn as spawn } from './process';
import { existsSync } from 'fs';
import { join as joinPath } from 'path';
import { chmodSync } from 'fs';
import { relative } from 'path';
import { ChildProcess } from 'child_process';
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

	constructor(cloneDirectory: string, keyFile: string = 'deploy_key') {
		this.cloneDirectory = cloneDirectory;
		this.keyFile = keyFile;
	}

	async add(... params: string[]): Promise<any> {
		return exec(`git add ${ params.join(' ') }`, { silent: true, cwd: this.cloneDirectory});
	}

	checkout(version: string) {
		return exec(`git checkout ${ version }`, { silent: true, cwd: this.cloneDirectory});
	}

	async clone(url: string) {
		if (!this.cloneDirectory) {
			throw new Error('A clone directory must be set');
		}
		console.log(`Cloning ${ url } to ${ this.cloneDirectory }`);
		await this.execSSHAgent('git', [ 'clone', url, this.cloneDirectory ], { silent: false });
		this.url = url;
	}

	async commit(message: string): Promise<any> {
		return this.execSSHAgent('git', ['commit', '-m', `"${ message }"`], { silent: true, cwd: this.cloneDirectory });
	}

	async createOrphan(branch: string) {
		if (!this.cloneDirectory) {
			throw new Error('A clone directory must be set');
		}
		await exec(`git checkout --orphan ${ branch }`, { silent: true, cwd: this.cloneDirectory });
		await exec('git rm -rf .', { silent: true, cwd: this.cloneDirectory });
		console.log(`Created "${ branch }" branch`);
	}

	ensureConfig(user: string = 'Travis CI', email: string = 'support@sitepen.com'): Promise<any> {
		return Promise.all([
			this.hasConfig('user.name').then((result) => {
				if (!result) {
					return this.setConfig('user.name', user)
				}
			}),
			this.hasConfig('user.email').then((result) => {
				if (!result) {
					return this.setConfig('user.email', email)
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
			return exec(`ssh-agent bash -c 'ssh-add ${ relativeDeployKey }; ${ command } ${ args.join(' ') }'`, options);
		}
		else {
			console.log(`Deploy Key "${ this.keyFile }" is not present. Using environment credentials for ${ args[0] }.`);
			return spawn(command, args, options);
		}
	}

	getConfig(key: string): Promise<string> {
		return exec(`git config ${ key }`, { silent: false })
			.then(function (proc) {
				return proc.stdout.toString();
			})
	}

	async areFilesChanged(): Promise<boolean> {
		const result: ChildProcess = await exec('git status --porcelain', { silent: true, cwd: this.cloneDirectory });
		return result.stdout.toString() !== '';
	}

	hasConfig(key: string): Promise<boolean> {
		return this.getConfig(key)
			.then(function () {
				return true;
			}, function () {
				return false;
			});
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
		return exec(`git config --global ${ key } ${ value }`, { silent: true });
	}
}
