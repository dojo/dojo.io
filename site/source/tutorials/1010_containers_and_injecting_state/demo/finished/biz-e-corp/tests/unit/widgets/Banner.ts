import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import Banner from '../../../src/widgets/Banner';

registerSuite({
	name: 'Banner',
	'render'() {
		const banner = new Banner();

		const vnode = <VNode> banner.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'h1');
		assert.equal(vnode.text, 'Biz-E-Bodies');
	}
});
