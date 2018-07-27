import { v } from '@dojo/framework/widget-core/d';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';

export default class HelloWorld extends WidgetBase {
	protected render() {
		return v('div', [ 'Hello, Dojo World!' ]);
	}
}
