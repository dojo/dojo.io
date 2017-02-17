import { existsSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';

const keyFile = 'deploy.key';

export function isRunningOnTravis(): boolean {
	return !!process.env.TRAVIS_BRANCH;
}

export function isBranch(branch: string): boolean {
	return process.env.TRAVIS_BRANCH === branch;
}

export function decryptDeployKey(): boolean {
	const keyTag = process.env['SSH_KEY_TAG'];
	const key = process.env[`encrypted_${keyTag}_key`];
	if (key == null) {
		return false;
	}

	if (existsSync(keyFile)) {
		return true;
	}

	try {
		execSync(`openssl aes-256-cbc -K $encrypted_${keyTag}_key -iv $encrypted_${keyTag}_iv -in ${keyFile}.enc -out ${keyFile} -d`);
		return true;
	}
	catch (error) {
		if (existsSync(keyFile)) {
			unlinkSync(keyFile);
		}
		return false;
	}
}
