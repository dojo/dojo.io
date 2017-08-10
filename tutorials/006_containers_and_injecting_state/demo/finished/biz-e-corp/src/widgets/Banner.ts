import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';

export default class Banner extends WidgetBase<WidgetProperties> {
	protected render(): DNode {
		return v('h1', { title: 'I am a title!' }, [ 'Biz-E-Bodies' ]);
	}
}
