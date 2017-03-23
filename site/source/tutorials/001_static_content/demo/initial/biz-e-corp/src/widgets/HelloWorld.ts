import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';

export default class HelloWorld extends WidgetBase<WidgetProperties> {
	render() {
		return v('div', [ 'Hello, Dojo World!' ]);
	}
}
