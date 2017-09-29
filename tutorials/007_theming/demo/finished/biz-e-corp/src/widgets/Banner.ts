import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';
import * as css from '../styles/banner.m.css';

const WorkerBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Banner extends WorkerBase {
	protected render() {
		return v('h1', { title: 'I am a title!', classes: this.classes(css.root) }, [ 'Biz-E-Bodies' ]);
	}
}
