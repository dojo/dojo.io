const { describe, it } = intern.getInterface('bdd');

import { v, w } from '@dojo/widget-core/d';
import harness from '@dojo/test-extras/harness';
import Banner from '../../../src/widgets/Banner';
import List from '../../../src/widgets/List';

describe('Banner', () => {
	it('should render', () => {
		const h = harness(() => w(Banner, {}));
		h.expect(() => [
			v('h1', { title: 'I am a title!' }, [ 'Welcome To Biz-E-Bodies' ]),
			v('label', [ 'Find a worker:' ]),
			w(List, {
				onInput: () => {},
				value: '',
				data: undefined
			})
		]);
	});
});
