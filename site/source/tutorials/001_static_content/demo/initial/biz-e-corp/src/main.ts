import renderer from '@dojo/framework/widget-core/vdom';
import { v } from '@dojo/framework/widget-core/d';

const r = renderer(() =>
	v('div', [ 'Hello, Dojo World!' ])
);
r.mount({ domNode: document.querySelector('my-app') as HTMLElement });
