import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import App from './widgets/App';
import { Registry } from '@dojo/framework/widget-core/Registry';
import { registerRouterInjector } from '@dojo/framework/routing/RouterInjector';
import routes from './routes';

const registry = new Registry();
registerRouterInjector(routes, registry);

const r = renderer(() => w(App, {}));
r.mount({ domNode: document.querySelector('my-app') as HTMLElement, registry });
