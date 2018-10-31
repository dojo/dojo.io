import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import App from './widgets/App';

const root = document.querySelector('my-app') as HTMLElement || undefined;

const r = renderer(() => w(App, {}));
r.mount({ domNode: root });
