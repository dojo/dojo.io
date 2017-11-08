import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { w, v } from '@dojo/widget-core/d';
import Worker, { WorkerProperties } from './Worker';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import * as css from '../styles/workerContainer.m.css';

export interface WorkerContainerProperties {
	workerData?: WorkerProperties[];
}

const WorkerContainerBase = ThemedMixin(WidgetBase);

@theme(css)
export default class WorkerContainer extends WorkerContainerBase<WorkerContainerProperties> {

	protected render() {
		const {
			workerData = []
		} = this.properties;

		const workers = workerData.map((worker, i) => w(Worker, {
			key: `worker-${i}`,
			...worker
		}));

		return v('div', {
			classes: [ this.theme(css.root), css.rootFixed ]
		}, workers);
	}
}
