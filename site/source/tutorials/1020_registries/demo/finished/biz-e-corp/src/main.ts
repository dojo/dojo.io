import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { Registry } from '@dojo/widget-core/Registry';
import App from './widgets/App';

import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';
import Banner from './widgets/Banner';
import WorkerForm from './widgets/WorkerForm';
import WorkerContainer from './widgets/WorkerContainer';
import Worker from './widgets/Worker';

const root = document.querySelector('my-app') || undefined;

const registry = new Registry();
registry.define('dojo-button', Button);
registry.define('dojo-text-input', TextInput);
registry.define('banner', Banner);
registry.define('worker', Worker);
registry.define('worker-form', WorkerForm);
registry.define('worker-container', WorkerContainer);

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.setProperties({ registry });

projector.append(root);
