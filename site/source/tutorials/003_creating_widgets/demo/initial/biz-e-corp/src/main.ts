import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import Banner from './widgets/Banner';

const r = renderer(() => w(Banner, {}));
r.mount({ domNode: document.querySelector('my-app') as HTMLElement });
