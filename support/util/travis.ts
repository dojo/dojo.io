export function isRunningOnTravis(): boolean {
	return !!process.env.TRAVIS_BRANCH;
}

export function isBranch(branch: string): boolean {
	return process.env.TRAVIS_BRANCH === branch;
}

export function hasDeployKey(): boolean {
	const keyTag = process.env['SSH_KEY_TAG'];
	const key = process.env[`encrypted_${keyTag}_key`];
	return key != null;
}
