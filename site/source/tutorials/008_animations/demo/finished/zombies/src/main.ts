import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Zombies from './widgets/Zombies';
import 'web-animations-js/web-animations-next-lite.min';

const Projector = ProjectorMixin(Zombies);
const projector = new Projector();
projector.append();
