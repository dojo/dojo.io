import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';
import Zombies from './widgets/Zombies';
import 'web-animations-js/web-animations-next-lite.min';

const r = renderer(() => w(Zombies, {}));
r.mount({ domNode: document.querySelector('my-app') as HTMLElement });
