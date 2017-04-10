import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { Button, TextInput } from '@dojo/widgets/main';

export default class HelloWorld extends WidgetBase<WidgetProperties> {
	render() {
		return v('div', {}, [
			v('h1', {
				styles: {
					'text-align': 'center'
				}
			}, [ 'Biz-E-Bodies' ])
		]);
	}
}
