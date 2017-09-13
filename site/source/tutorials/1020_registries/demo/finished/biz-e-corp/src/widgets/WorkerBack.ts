import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';

import * as css from '../styles/workerBack.css';

export interface WorkerBackProperties {
	firstName?: string;
	lastName?: string;
	email?: string;
	timePerTask?: number;
	tasks?: string[];
}

const WorkerBackBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class WorkerBack extends WorkerBackBase<WorkerBackProperties> {

	protected render() {
		const {
			firstName = 'firstName',
			lastName = 'lastName',
			email = 'unavailable',
			timePerTask = 0,
			tasks = []
		} = this.properties;

		return [
			v('img', {
				classes: this.classes(css.imageSmall),
				src: 'images/worker.svg'
			}),
			v('div', {
				classes: this.classes(css.generalInfo)
			}, [
				v('div', {
					classes : this.classes(css.label)
				}, ['Name']),
				v('div', [`${lastName}, ${firstName}`]),
				v('div', {
					classes: this.classes(css.label)
				}, ['Email']),
				v('div', [`${email}`]),
				v('div', {
					classes: this.classes(css.label)
				}, ['Avg. Time per Task']),
				v('div', [`${timePerTask}`])
			]),
			v('div', [
				v('strong', ['Current Tasks']),
				v('div', tasks.map(task => {
					return v('div', { classes: this.classes(css.task) }, [ task ]);
				}))
			])
		];
	}
}
