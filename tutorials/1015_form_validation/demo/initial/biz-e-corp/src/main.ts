import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { Registry } from '@dojo/widget-core/Registry';

import ApplicationContext from './ApplicationContext';
import App from './widgets/App';

const root = document.querySelector('my-app') || undefined;

const applicationContext = new ApplicationContext([
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

const registry = new Registry();
registry.defineInjector('app-state', applicationContext);

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.setProperties({ registry });

projector.append(root);
