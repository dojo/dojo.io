import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';
import * as css from '../styles/banner.m.css';

const WorkerBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Banner extends WorkerBase {
	protected render() {
		return v('h1', { title: 'I am a title!', classes: this.theme(css.root) }, [ 'Biz-E-Bodies' ]);
	}
}
