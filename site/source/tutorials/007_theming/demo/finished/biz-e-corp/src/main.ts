import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import App from './widgets/App';
import { registerThemeInjector } from '@dojo/widget-core/mixins/Themed';
import { Registry } from '@dojo/widget-core/Registry';
import theme from './themes/dojo/theme';

const root = document.querySelector('my-app') || undefined;
const registry = new Registry();
registerThemeInjector(theme, registry);

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.setProperties({
	registry
});

projector.append(root);
