import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { registry } from '@dojo/widget-core/decorators/registry';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';

import * as css from '../styles/worker.m.css';
import WorkerBack from './WorkerBack';

export interface WorkerProperties {
	firstName?: string;
	lastName?: string;
	email?: string;
	timePerTask?: number;
	tasks?: string[];
}

const WorkerBase = ThemedMixin(WidgetBase);

@theme(css)
@registry('worker-back', () => import ('./WorkerBack'))
export default class Worker extends WorkerBase<WorkerProperties> {
	private _isFlipped = false;

	protected render() {
		return v('div', {
			classes: this.theme([ css.worker, this._isFlipped ? css.reverse : null ])
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
				classes: this.theme(css.workerFront),
				onclick: this.flip
			}, [
				v('img', {
					classes: this.theme(css.image),
					src: 'https://dojo.io/tutorials/resources/worker.svg' }, []),
				v('div', [
					v('strong', [ `${lastName}, ${firstName}` ])
				])
			]
		);
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
			classes: this.theme(css.workerBack),
			onclick: this.flip
		}, [
			this._isFlipped
				? w<WorkerBack>('worker-back', {
					firstName,
					lastName,
					email,
					timePerTask,
					tasks })
				: null
		]);
	}

	flip(): void {
		this._isFlipped = !this._isFlipped;
		this.invalidate();
	}
}
