import harness, { Harness } from '@dojo/test-extras/harness';
import Banner from '../../../src/widgets/Banner';
// Uncomment this to test the completed functionality
// import List from '../../../src/widgets/List';
// import { v, w } from '@dojo/widget-core/d';

const { describe, it, beforeEach, afterEach} = intern.getInterface('bdd');
let bannerHarness: Harness<Banner>;

describe('Banner', () => {
	beforeEach(() =>  {
		bannerHarness = harness(Banner);
	});

	afterEach(() => {
		bannerHarness.destroy();
	});

	it('should render', () => {
		// Uncomment this to test the completed functionality
		// bannerHarness.expectRender([
		// 	v('h1', { title: 'I am a title!' }, [ 'Welcome To Biz-E-Bodies' ]),
		// 	v('label', [ 'Find a worker:' ]),
		// 	w(List, {
		// 		onInput: () => {},
		// 		value: '',
		// 		data: undefined
		// 	})
		// ]);
	});
});
