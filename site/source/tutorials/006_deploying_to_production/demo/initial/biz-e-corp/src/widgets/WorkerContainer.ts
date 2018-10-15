import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { w, v } from '@dojo/framework/widget-core/d';
import Worker, { WorkerProperties } from './Worker';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import * as css from '../styles/workerContainer.m.css';

export interface WorkerContainerProperties {
	workerData?: WorkerProperties[];
}

@theme(css)
export default class WorkerContainer extends ThemedMixin(WidgetBase)<WorkerContainerProperties> {

	protected render() {
		const {
			workerData = []
		} = this.properties;

		const workers = workerData.map((worker, i) => w(Worker, {
			key: `worker-${i}`,
			...worker
		}));

		return v('div', {
			classes: this.theme(css.container)
		}, workers);
	}
}
