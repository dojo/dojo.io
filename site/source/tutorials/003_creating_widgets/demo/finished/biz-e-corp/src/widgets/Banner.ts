import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';

export default class Banner extends WidgetBase<WidgetProperties> {
	render() {
		return v('h1', {
			styles: {
				'text-align': 'center'
			}
		},
		[ 'Biz-E-Bodies' ]);
	}
}
