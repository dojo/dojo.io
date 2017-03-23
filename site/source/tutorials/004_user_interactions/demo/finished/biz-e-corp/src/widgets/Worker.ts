import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';
import * as styles from '../styles/worker.css';

export interface WorkerProperties extends WidgetProperties {
	firstName?: string
	lastName?: string
	email?: string
	timePerTask?: number
	tasks?: string[]
}

const WorkerBase = ThemeableMixin(WidgetBase);

@theme(styles)
export default class Worker extends WorkerBase<WorkerProperties> {
	private _isFlipped = false;

	render(): DNode {
		return this._isFlipped ? this._renderBack() : this._renderFront();
	}

	private _renderFront(): DNode {
		const {
			firstName = 'firstName',
			lastName = 'lastName'
		} = this.properties;

		return v('div', {
			classes: this.classes(styles.workerFront),
			onclick: this.flip
		}, [
			v('img', {
				classes: this.classes(styles.image),
					src: 'images/worker.jpg' }, []),
				v('div', [
					v('strong', [ `${lastName}, ${firstName}` ])
				])
			]
		);
	}

	private _renderBack(): DNode {
		const {
			firstName = 'firstName',
			lastName = 'lastName',
			email = 'unavailable',
			timePerTask = 0,
			tasks = []
		} = this.properties;

		return v('div', {
			classes: this.classes(styles.workerBack),
			onclick: this.flip
			}, [
				v('img', {
						classes: this.classes(styles.imageSmall),
						src: 'images/worker.jpg'
					}, []
				),
				v('div', {
					classes: this.classes(styles.generalInfo)
				}, [
					v('div', {
						classes : this.classes(styles.label)
					}, ['Name']),
					v('div', [`${lastName}, ${firstName}`]),
					v('div', {
						classes: this.classes(styles.label)
					}, ['Email']),
					v('div', [`${email}`]),
					v('div', {
						classes: this.classes(styles.label)
					}, ['Avg. Time per Task']),
					v('div', [`${timePerTask}`])
				]),
				v('div', [
					v('strong', ['Current Tasks']),
					v('div', tasks.map(task => {
						return v('div', {
								classes: this.classes(styles.task)
							},
							[task]
						);
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
