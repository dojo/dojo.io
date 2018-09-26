import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import { registerThemeInjector } from '@dojo/framework/widget-core/mixins/Themed';
import { Registry } from '@dojo/framework/widget-core/Registry';
import App from './widgets/App';
import theme from './themes/dojo/theme';

const registry = new Registry();
registerThemeInjector(theme, registry);

const r = renderer(() => w(App, {}));
r.mount({ domNode: document.querySelector('my-app') as HTMLElement, registry });
