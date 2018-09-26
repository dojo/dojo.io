import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import * as css from '../styles/banner.m.css';

@theme(css)
export default class Banner extends ThemedMixin(WidgetBase) {
	protected render() {
		return v('h1', {
			title: 'I am a title!',
			classes: this.theme(css.root)
		}, [ 'Biz-E-Bodies' ]);
	}
}
