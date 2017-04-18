import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import Worker from './Worker';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import * as styles from '../styles/workerContainer.css';

const WorkerContainerBase = ThemeableMixin(WidgetBase);

@theme(styles)
export default class WorkerContainer extends WorkerContainerBase<ThemeableProperties> {
	render(): DNode {
		const workers: DNode[] = [
			w(Worker, {
				key: '1',
				firstName: 'Tim',
				lastName: 'Jones'
			}),
			w(Worker, {
				key: '2',
				firstName: 'Alicia',
				lastName: 'Fitzgerald'
			}),
			w(Worker, {
				key: '3',
				firstName: 'Hans',
				lastName: 'Mueller'
			})
		];

		return v('div', {
			classes: this.classes(styles.container)
		}, workers);
	}
}
