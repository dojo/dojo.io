import * as registerSuite from 'intern/lib/interfaces/object';
import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import Banner from '../../../src/widgets/Banner';

let bannerHarness: Harness<WidgetProperties, typeof Banner>;

registerSuite({
	name: 'Banner',
	beforeEach() {
		bannerHarness = harness(Banner);
	},

	afterEach() {
		bannerHarness.destroy();
	},

	render() {
		bannerHarness.expectRender(v('h1', { title: 'I am a title!' }, [ 'Biz-E-Bodies' ]));
	}
});
