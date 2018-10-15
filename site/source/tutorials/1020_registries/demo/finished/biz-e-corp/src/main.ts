import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import { Registry } from '@dojo/framework/widget-core/Registry';
import App from './widgets/App';

import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';
import Banner from './widgets/Banner';
import WorkerForm from './widgets/WorkerForm';
import WorkerContainer from './widgets/WorkerContainer';
import Worker from './widgets/Worker';

const registry = new Registry();
registry.define('dojo-button', Button);
registry.define('dojo-text-input', TextInput);
registry.define('banner', Banner);
registry.define('worker', Worker);
registry.define('worker-form', WorkerForm);
registry.define('worker-container', WorkerContainer);

const r = renderer(() => w(App, {}));
r.mount({ domNode: document.querySelector('my-app') as HTMLElement, registry });
