import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import App from './widgets/App';
import { registerThemeInjector } from '@dojo/widget-core/mixins/Themeable';
import { WidgetRegistry } from '@dojo/widget-core/WidgetRegistry';
import theme from './themes/dojo/theme';

const root = document.querySelector('my-app') || undefined;
const registry = new WidgetRegistry();
registerThemeInjector(theme, registry);

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.setProperties({
	registry
});

projector.append(root);
