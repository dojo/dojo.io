import * as registerSuite from 'intern/lib/interfaces/object';
import { v } from '@dojo/widget-core/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import HelloWorld from '../../../src/widgets/HelloWorld';

let helloWorldHarness: Harness<WidgetProperties, typeof HelloWorld>;
registerSuite({
	name: 'HelloWorld',

	beforeEach() {
		helloWorldHarness = harness(HelloWorld);
	},

	afterEach() {
		helloWorldHarness.destroy();
	},

	render() {
		helloWorldHarness.expectRender(v('div', [ 'Hello, Dojo World!' ]));
	}
});
