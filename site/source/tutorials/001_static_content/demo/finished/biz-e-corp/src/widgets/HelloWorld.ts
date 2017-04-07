import { v } from '@dojo/widget-core/d';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

export default class HelloWorld extends WidgetBase<WidgetProperties> {
	protected render(): DNode {
		return v('h1', { title: 'I am a tooltip!' }, [ 'Biz-E Bodies' ]);
	}
}
