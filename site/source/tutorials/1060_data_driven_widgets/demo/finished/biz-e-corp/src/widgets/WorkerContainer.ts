import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { w, v } from '@dojo/widget-core/d';
import Worker, { WorkerProperties } from './Worker';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import * as css from '../styles/workerContainer.m.css';

import { Link } from '@dojo/routing/Link';

export interface WorkerContainerProperties {
	workerData: WorkerProperties[];
	filter?: string;
}

const WorkerContainerBase = ThemedMixin(WidgetBase);

@theme(css)
export default class WorkerContainer extends WorkerContainerBase<WorkerContainerProperties> {

	private _createFilterLinks() {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const links = [];
		for (let i = 0; i < alphabet.length; i++) {
			const char = alphabet.charAt(i);
			links.push(
				v('span', { classes: this.theme(css.links) }, [
					w(Link, { key: char, to: 'filter', params: { filter: char }}, [ char ])
				])
			);
		}
		return links;
	}

	protected render() {
		const {
			workerData = [],
			filter
		} = this.properties;

		const workers = workerData.filter((worker) => {
			if (filter) {
				return worker.lastName && worker.lastName.charAt(0).toUpperCase() === filter;
			}
			return true;
		}).map((worker, i) => w(Worker, {
			key: `worker-${i}`,
			...worker
		}));

		return v('div', {}, [
			v('h1', { classes: this.theme(css.title) }, [ 'Worker Directory' ]),
			v('div', { classes: this.theme(css.filters) }, this._createFilterLinks()),
			v('div', { classes: this.theme(css.container) }, workers)
		]);
	}
}
