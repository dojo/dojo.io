import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import getGithubSlug from 'support/grunt/commands/getGithubSlug';
import { stub } from 'sinon';

function assertEnvironment(key: string) {
	process.env[key] = 'devpaul/dojo.io';
	const { name, owner } = getGithubSlug();
	assert.strictEqual(owner, 'devpaul');
	assert.strictEqual(name, 'dojo.io');
}

let processCache: any;

registerSuite({
	name: 'getGithubSlug',

	beforeEach() {
		processCache = {
			TRAVIS_REPO_SLUG: process.env.TRAVIS_REPO_SLUG,
			PUBLISH_TARGET_REPO: process.env.PUBLISH_TARGET_REPO
		};
		delete process.env.TRAVIS_REPO_SLUG;
		delete process.env.PUBLISH_TARGET_REPO;
	},

	afterEach() {
		for (let key in processCache) {
			process.env[key] = processCache[key];
		}
	},

	'grunt repo option'() {
		const gruntMock: any = {
			option: stub().returns('devpaul/dojo.io')
		};
		const { name, owner } = getGithubSlug(null, gruntMock);
		assert.strictEqual(owner, 'devpaul');
		assert.strictEqual(name, 'dojo.io');
	},

	'options repo'() {
		const { name, owner } = getGithubSlug({ repo: 'devpaul/dojo.io' });
		assert.strictEqual(owner, 'devpaul');
		assert.strictEqual(name, 'dojo.io');
	},

	'PUBLISH_TARGET_REPO environment variable'() {
		assertEnvironment('PUBLISH_TARGET_REPO');

	},

	'TRAVIS_REPO_SLUG environment variable'() {
		assertEnvironment('TRAVIS_REPO_SLUG');
	},

	'no repo option'() {
		const { name, owner } = getGithubSlug();
		assert.isUndefined(name);
		assert.isUndefined(owner);
	}
});
