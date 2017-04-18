import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';

export default class HelloWorld extends WidgetBase<WidgetProperties> {
	protected render(): DNode {
		return v('h1', {
			styles: {
				'text-align': 'center'
			}
		},
		[ 'Biz-E-Bodies' ]);
	}
}
