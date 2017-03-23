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

export function ensureGitRepo(path: string, repoUrl: string) {
	return getRemoteUrl()
		.then(function (url) {
			shell.cd(path);

			if (!existsSync(joinPath(path, '.git'))) {
				throw new Error('Not a git repository');
			}

			if (url !== repoUrl) {
				throw new Error(`expected repo url of ${ repoUrl }. Instead got ${ url }`);
			}
		});
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
			console.log(`Deploy Key "${ this.keyFile }" is not present. Using environment credentials.`);
			return spawn(command, args, options);
		}
	}

	getConfig(key: string): Promise<string> {
		return exec(`git config ${ key }`, { silent: true })
			.then(function (proc) {
				return proc.stdout.toString();
			})
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

	push(branch: string) {
		return this.execSSHAgent('git', [ 'push', 'origin', branch ], { silent: true, cwd: this.cloneDirectory });
	}

	setConfig(key: string, value: string) {
		// TODO make global optional
		return exec(`git config --global ${ key } ${ value }`, { silent: true });
	}
}
