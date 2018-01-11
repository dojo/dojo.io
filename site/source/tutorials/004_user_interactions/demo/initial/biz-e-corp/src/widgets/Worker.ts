import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import * as css from '../styles/worker.m.css';

export interface WorkerProperties {
	firstName?: string;
	lastName?: string;
}

const WorkerBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Worker extends WorkerBase<WorkerProperties> {
	protected render() {
		const {
			firstName = 'firstName',
			lastName = 'lastName'
		} = this.properties;

		return v('div', {
				classes: this.theme(css.worker)
			}, [
				v('img', {
					classes: this.theme(css.image),
					src: 'https://dojo.io/tutorials/resources/worker.svg' }),
				v('div', [
					v('strong', [ `${lastName}, ${firstName}` ])
				])
			]
		);
	}
}
