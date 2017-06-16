import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import Banner from './Banner';
import WorkerContainerContainer from './../containers/WorkerContainerContainer';
import WorkerFormContainer from './../containers/WorkerFormContainer';

export default class App extends WidgetBase<WidgetProperties> {

	protected render(): DNode {
		return v('div', [
			w(Banner, {}),
			w(WorkerFormContainer, <any> {}),
			w(WorkerContainerContainer, {})
		]);
	}
}
