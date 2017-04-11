import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';
import * as styles from '../styles/worker.css';

export interface WorkerProperties extends WidgetProperties {
	firstName?: string;
	lastName?: string;
}

const WorkerBase = ThemeableMixin(WidgetBase);

@theme(styles)
export default class Worker extends WorkerBase<WorkerProperties> {
	render(): DNode {
		const {
			firstName = 'firstName',
			lastName = 'lastName'
		} = this.properties;

		return v('div', {
			classes: this.classes(styles.worker)
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
}
