import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
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
				firstName: 'Tim',
				lastName: 'Jones',
				email: 'tim.jones@bizecorp.org',
				tasks: [
					'6267 - Untangle paperclips',
					'4384 - Shred documents',
					'9663 - Digitize 1985 archive'
				]
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
			classes: this.classes(styles.container)
		}, workers);
	}
}
