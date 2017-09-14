import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { WidgetRegistry } from '@dojo/widget-core/WidgetRegistry';
import { registerRouterInjector } from '@dojo/routing/RouterInjector';

import App from './widgets/App';

const root = document.querySelector('my-app') || undefined;

const routingConfig = [
	{
		path: '/',
		outlet: 'home',
		defaultRoute: true,
		children: [
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
			}
		]
	}
];

const registry = new WidgetRegistry();
const router = registerRouterInjector(routingConfig, registry);

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.setProperties({ registry });

projector.append(root);
router.start();
