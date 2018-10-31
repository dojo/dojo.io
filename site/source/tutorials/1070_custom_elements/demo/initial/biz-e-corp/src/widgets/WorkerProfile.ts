import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import * as css from '../styles/worker.m.css';

export interface WorkerProfileProperties {
	firstName?: string;
	lastName?: string;
	email?: string;
	timePerTask?: number;
	tasks?: string[];
	onSelected?: (data: any) => void;
}

@theme(css)
export default class WorkerProfile extends ThemedMixin(WidgetBase)<WorkerProfileProperties> {

	private _onClick() {
		this.properties.onSelected && this.properties.onSelected(this.properties);
	}

	protected render() {

		const {
			firstName = 'firstName',
			lastName = 'lastName',
			email = 'unavailable',
			timePerTask = 0,
			tasks = []
		} = this.properties;

		return v('div', {
			classes: this.theme([ css.worker ]),
			onclick: this._onClick
		}, [
			v('img', {
				classes: this.theme(css.image),
				src: 'https://dojo.io/tutorials/resources/worker.svg'
			}),
			v('div', {
				classes: this.theme(css.generalInfo)
			}, [
				v('div', {
					classes : this.theme(css.label)
				}, ['Name']),
				v('div', [`${lastName}, ${firstName}`]),
				v('div', {
					classes: this.theme(css.label)
				}, ['Email']),
				v('div', [`${email}`]),
				timePerTask ? v('div', {
					classes: this.theme(css.label)
				}, ['Avg. Time per Task']) : undefined,
				timePerTask ? v('div', [`${timePerTask}`]) : undefined
			]),
			tasks && tasks.length ? v('div', [
				v('strong', ['Current Tasks']),
				v('div', tasks.map(task => {
					return v('div', { classes: this.theme(css.task) }, [ task ]);
				}))
			]) : undefined
		]);
	}

}
