import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import Worker from './Worker';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import * as css from '../styles/workerContainer.css';

const WorkerContainerBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class WorkerContainer extends WorkerContainerBase<ThemeableProperties> {
	protected render(): DNode {
		const workers: DNode[] = [
			w(Worker, {
				firstName: 'Tim',
				lastName: 'Jones'
			}),
			w(Worker, {
				firstName: 'Alicia',
				lastName: 'Fitzgerald'
			}),
			w(Worker, {
				firstName: 'Hans',
				lastName: 'Mueller'
			})
		];

		return v('div', {
			classes: this.classes(css.container)
		}, workers);
	}
}
