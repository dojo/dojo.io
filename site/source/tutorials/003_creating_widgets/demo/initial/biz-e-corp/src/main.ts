import { ProjectorMixin } from '@dojo/framework/widget-core/mixins/Projector';
import Banner from './widgets/Banner';

const root = document.querySelector('my-app') || undefined;

const Projector = ProjectorMixin(Banner);
const projector = new Projector();

projector.append(root);
