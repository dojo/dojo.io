import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import Banner from './Banner';
import WorkerForm, { WorkerFormData } from './WorkerForm';
import { WorkerProperties } from './Worker';
import WorkerContainerContainer from './../containers/WorkerContainerContainer';
import WorkerFormContainer from './../containers/WorkerFormContainer';

const defaultForm = {
	firstName: undefined,
	lastName: undefined,
	email: undefined
};

export default class App extends WidgetBase {

	protected render(): DNode {
		return v('div', [
			w(Banner, {}),
			w(WorkerFormContainer, <any> {}),
			w(WorkerContainerContainer, {})
		]);
	}
}
