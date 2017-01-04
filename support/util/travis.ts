export function isRunningOnTravis(): boolean {
	return !!process.env.TRAVIS_BRANCH;
}

export function isBranch(branch: string): boolean {
	return process.env.TRAVIS_BRANCH === branch;
}
