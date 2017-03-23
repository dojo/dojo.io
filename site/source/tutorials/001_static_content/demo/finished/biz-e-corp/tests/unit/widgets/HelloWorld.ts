import * as registerSuite from 'intern/lib/interfaces/object';
import { assert } from 'chai';
import { VNode } from '@dojo/interfaces/vdom';
import HelloWorld from '../../../src/widgets/HelloWorld';

registerSuite({
	name: 'HelloWorld',
	'render'() {
		const helloWorld = new HelloWorld();

		const vnode = <VNode> helloWorld.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'div');
		assert.equal(vnode.text, 'Hello, Dojo World!');
	}
});
