import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import Banner from '../../../src/widgets/Banner';
import * as css from '../../../src/styles/banner.m.css';

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
		bannerHarness.expectRender(v('h1', { title: 'I am a title!', classes: css.root }, [ 'Biz-E-Bodies' ]));
	});
});
