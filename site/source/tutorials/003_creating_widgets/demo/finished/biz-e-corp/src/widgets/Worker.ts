import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';
import * as css from '../styles/worker.css';

export interface WorkerProperties extends WidgetProperties {
	firstName?: string;
	lastName?: string;
}

const WorkerBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Worker extends WorkerBase<WorkerProperties> {
	protected render(): DNode {
		const {
			firstName = 'firstName',
			lastName = 'lastName'
		} = this.properties;

		return v('div', {
				classes: this.classes(css.worker)
			}, [
				v('img', {
					classes: this.classes(css.image),
					src: 'images/worker.svg' }),
				v('div', [
					v('strong', [ `${lastName}, ${firstName}` ])
				])
			]
		);
	}
}
