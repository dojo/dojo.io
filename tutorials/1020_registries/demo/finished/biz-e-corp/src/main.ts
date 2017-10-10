import load from '@dojo/core/load';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { Registry } from '@dojo/widget-core/Registry';
import App from './widgets/App';

import Button from '@dojo/widgets/button/Button';
import TextInput from '@dojo/widgets/textinput/TextInput';
import Banner from './widgets/Banner';
import WorkerForm from './widgets/WorkerForm';
import WorkerContainer from './widgets/WorkerContainer';
import Worker from './widgets/Worker';

import { Require } from '@dojo/interfaces/loader';

declare const require: Require;

const root = document.querySelector('my-app') || undefined;

const registry = new Registry();
registry.define('dojo-button', Button);
registry.define('dojo-text-input', TextInput);
registry.define('banner', Banner);
registry.define('worker', Worker);
registry.define('worker-form', WorkerForm);
registry.define('worker-container', WorkerContainer);
registry.define('worker-back', () => {
	return load(require, './widgets/WorkerBack').then(([WorkerBack]) => WorkerBack.default);
});

const Projector = ProjectorMixin(App);
const projector = new Projector();
projector.setProperties({ registry });

projector.append(root);
