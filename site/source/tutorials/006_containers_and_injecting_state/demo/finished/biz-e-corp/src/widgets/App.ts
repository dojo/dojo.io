import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import Banner from './Banner';
import WorkerForm, { WorkerFormData } from './WorkerForm';
import { WorkerProperties } from './Worker';
import WorkerContainerContainer from './../containers/WorkerContainerContainer';
import WorkerFormContainer from './../containers/WorkerFormContainer';

export const AppBase = StatefulMixin(WidgetBase);

const defaultForm = {
	firstName: undefined,
	lastName: undefined,
	email: undefined
};

export default class App extends AppBase<WidgetProperties> {

	protected render(): DNode {
		return v('div', [
			w(Banner, {}),
			w(WorkerFormContainer, <any> {}),
			w(WorkerContainerContainer, {})
		]);
	}
}
