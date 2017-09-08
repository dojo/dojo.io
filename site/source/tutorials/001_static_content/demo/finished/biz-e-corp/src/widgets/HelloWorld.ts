import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

export default class HelloWorld extends WidgetBase {
	protected render() {
		return v('h1', { title: 'I am a title!' }, [ 'Biz-E-Bodies' ]);
	}
}
