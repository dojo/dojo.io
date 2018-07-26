import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import Banner from './Banner';
import WorkerContainerContainer from './../containers/WorkerContainerContainer';
import WorkerFormContainer from './../containers/WorkerFormContainer';

export default class App extends WidgetBase {

	protected render() {
		return v('div', [
			w(Banner, {}),
			w(WorkerFormContainer, {}),
			w(WorkerContainerContainer, {})
		]);
	}
}
