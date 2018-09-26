import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import { Registry } from '@dojo/framework/widget-core/Registry';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';

import App from './widgets/App';

const routingConfig = [
	{
		path: 'directory',
		outlet: 'directory',
		children: [
			{
				path: '{filter}',
				outlet: 'filter'
			}
		]
	},
	{
		path: 'new-worker',
		outlet: 'new-worker'
	},
	{
		path: '/',
		outlet: 'home',
		defaultRoute: true
	}
];

const registry = new Registry();
registerRouterInjector(routingConfig, registry);

const r = renderer(() => w(App, {}));
r.mount({ domNode: document.querySelector('my-app') as HTMLElement, registry });
