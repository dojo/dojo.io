import { existsSync } from 'fs';
import { PublishMode } from '../commands/publish';

/**
 * @return the current branch as defined by the environment
 */
export function currentBranch(): string {
	return process.env.TRAVIS_BRANCH;
}

/**
 * @return the environment variable name holding the decryption iv value
 */
export function decryptIvName() {
	return 'publish_deploy_iv';
}

/**
 * @return the environment variable name holding the decryption key value
 */
export function decryptKeyName() {
	return 'publish_deploy_key';
}

/**
 * @return the name of the encrypted keyFile
 */
export function encryptedKeyFile(file = keyFile()) {
	return `${ file }.enc`;
}

/**
 * @return the hash of the commit that triggered this build
 */
export function gitCommit(): string {
	return process.env.TRAVIS_COMMIT;
}

/**
 * @param keyFile the filename of the key file to use for git credentials
 * @return {boolean} if the current environment will be able to run git commands requiring credentials
 */
export function hasGitCredentials(keyFile?: string): boolean {
	if (process.env.hasOwnProperty('HAS_GIT_CREDENTIALS')) {
		// allow for this check to be overridden in case credentials are provided to the environment in another way
		// e.g. registering a deploy key or GitHub oauth ID with Travis
		return process.env.HAS_GIT_CREDENTIALS === 'true';
	}
	if (isRunningOnTravis()) {
		// If we are running on Travis then assume we need they key file
		return hasKeyFile(keyFile);
	}

	// If we are not running on Travis then assume that we are running locally and have git credentials
	return true;
}

export function hexoRootOverride() {
	return process.env.HEXO_ROOT;
}

/**
 * @param file the filename of the key file used ssh+git permissions
 * @return {boolean} if the defined key file exists
 */
export function hasKeyFile(file: string = keyFile()): boolean {
	return existsSync(file);
}

/**
 * @return if the build was triggered by a cron job
 */
export function isCronJob(): boolean {
	return process.env.TRAVIS_EVENT_TYPE === 'cron';
}

/**
 * @return {boolean} if we are currently running on Travis
 */
export function isRunningOnTravis(): boolean {
	return !!process.env.TRAVIS_BRANCH;
}

/**
 * @return the name of the key file used for deploys as defined by the environment
 */
export function keyFile(): string {
	return process.env.KEY_FILE || 'deploy_key';
}

/**
 * @return The current publish mode defined by the environment
 */
export function publishMode(defaultValue: PublishMode = isRunningOnTravis() ? 'skip' : 'commit'): PublishMode {
	return process.env.DEPLOY_DOCS || defaultValue;
}

/**
 * @return the current Github repository as defined by the environment (e.g. dojo/core)
 */
export function repositorySource(): string {
	return process.env.PUBLISH_TARGET_REPO || process.env.TRAVIS_REPO_SLUG || '';
}
