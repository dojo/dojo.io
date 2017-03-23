import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import Banner from './Banner';
import WorkerContainer from './WorkerContainer';

export default class App extends WidgetBase<WidgetProperties> {
	render(): DNode {
		return v('div', [
			w(Banner, {}),
			w(WorkerContainer, {})
		]);
	}
}
