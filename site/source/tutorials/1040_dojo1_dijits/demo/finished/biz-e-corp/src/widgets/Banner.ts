import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';

export default class Banner extends WidgetBase {
	protected render() {
		return v('h1', { title: 'I am a title!' }, [ 'Biz-E-Bodies' ]);
	}
}
