import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import HelloWorld from '../../../src/widgets/HelloWorld';

const { describe, it, beforeEach, afterEach } = intern.getInterface('bdd');
let helloWorldHarness: Harness<HelloWorld>;

describe('HelloWorld', () => {
	beforeEach(() => {
		helloWorldHarness = harness(HelloWorld);
	});

	afterEach(() => {
		helloWorldHarness.destroy();
	});

	it('should render', () => {
		helloWorldHarness.expectRender(v('h1', { title: 'I am a title!' }, [ 'Biz-E-Bodies' ]));
	});
});
