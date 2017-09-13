import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';
import * as css from '../styles/worker.css';

export interface WorkerProperties {
	firstName?: string;
	lastName?: string;
	email?: string;
	timePerTask?: number;
	tasks?: string[];
}

const WorkerBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Worker extends WorkerBase<WorkerProperties> {
	private _isFlipped = false;

	protected render() {
		return v('div', {
			classes: this.classes(css.worker, this._isFlipped ? css.reverse : null)
		}, [
			this._renderFront(),
			this._renderBack()
		]);
	}

	private _renderFront() {
		const {
			firstName = 'firstName',
			lastName = 'lastName'
		} = this.properties;

		return v('div', {
			key: 'front',
			classes: this.classes(css.workerFront),
			onclick: this.flip
		}, [
			v('img', {
				classes: this.classes(css.image),
				src: 'images/worker.svg'
			}),
			v('div', [
				v('strong', [ `${lastName}, ${firstName}` ])
			])
		]);
	}

	private _renderBack() {
		const {
			firstName = 'firstName',
			lastName = 'lastName',
			email = 'unavailable',
			timePerTask = 0,
			tasks = []
		} = this.properties;

		return v('div', {
			key: 'back',
			classes: this.classes(css.workerBack),
			onclick: this.flip
			}, [
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
						return v('div', {
							classes: this.classes(css.task)
						}, [task]);
					}))
				])
			]
		);
	}

	flip(): void {
		this._isFlipped = !this._isFlipped;
		this.invalidate();
	}
}
