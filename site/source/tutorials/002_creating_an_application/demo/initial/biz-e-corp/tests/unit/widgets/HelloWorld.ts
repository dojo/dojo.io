import * as registerSuite from 'intern/lib/interfaces/object';
import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import { Constructor, WidgetProperties } from '@dojo/widget-core/interfaces';
import HelloWorld from '../../../src/widgets/HelloWorld';

let bannerHarness: Harness<WidgetProperties, Constructor<HelloWorld>>;

registerSuite({
	name: 'HelloWorld',
	beforeEach() {
		bannerHarness = harness(HelloWorld);
	},

	afterEach() {
		bannerHarness.destroy();
	},

	render() {
		bannerHarness.expectRender(v('h1', { title: 'I am a title!' }, [ 'Biz-E-Bodies' ]));
	}
});
