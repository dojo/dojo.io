const { describe, it } = intern.getInterface('bdd');

import { v, w } from '@dojo/framework/widget-core/d';
import harness from '@dojo/framework/testing/harness';
import HelloWorld from '../../../src/widgets/HelloWorld';

describe('HelloWorld', () => {
	it('should render', () => {
		const h = harness(() => w(HelloWorld, {}));
		h.expect(() => v('h1', { title: 'I am a title!' }, [ 'Biz-E-Bodies' ]));
	});
});
