import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import { Registry } from '@dojo/framework/widget-core/Registry';

import ApplicationContext from './ApplicationContext';
import App from './widgets/App';

const root = document.querySelector('my-app') as HTMLElement || undefined;

const registry = new Registry();
registry.defineInjector('app-state', (invalidator) => {
	const applicationContext = new ApplicationContext(invalidator, [
		{
			firstName: 'Tim',
			lastName: 'Jones',
			email: 'tim.jones@bizecorp.org',
			tasks: [
				'6267 - Untangle paperclips',
				'4384 - Shred documents',
				'9663 - Digitize 1985 archive'
			]
		},
		{
			firstName: 'Alicia',
			lastName: 'Fitzgerald'
		},
		{
			firstName: 'Hans',
			lastName: 'Mueller'
		}
	]);
	return () => applicationContext;
});

const r = renderer(() => w(App, {}));
r.mount({ domNode: document.querySelector('my-app') as HTMLElement, registry });
