import renderer from '@dojo/framework/widget-core/vdom';
import { v } from '@dojo/framework/widget-core/d';

const r = renderer(() =>
	v('h1', { title: 'I am a title!' }, [ 'Biz-E-Bodies' ])
);
r.mount({ domNode: document.querySelector('my-app') as HTMLElement });
