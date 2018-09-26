import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import HelloWorld from './widgets/HelloWorld';

const r = renderer(() => w(HelloWorld, {}));
r.mount({ domNode: document.querySelector('my-app') as HTMLElement });
