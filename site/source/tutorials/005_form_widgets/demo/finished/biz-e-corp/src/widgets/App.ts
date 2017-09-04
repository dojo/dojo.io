import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import Banner from './Banner';
import WorkerForm, { WorkerFormData } from './WorkerForm';
import { WorkerProperties } from './Worker';
import WorkerContainer from './WorkerContainer';

const defaultForm = {
	firstName: undefined,
	lastName: undefined,
	email: undefined
};

export default class App extends WidgetBase {

	private _state: any = defaultForm;

	private _workerData: WorkerProperties[] = [
		{
			firstName: 'Tim',
			lastName: 'Jones',
			email: 'tim.jones@bizecorp.org',
			tasks: [
				'6267 - Untangle paperclips',
				'4384 - Shred documents',
				'9663 - Digitize 1985 archive'
			]
		},
		{
			firstName: 'Alicia',
			lastName: 'Fitzgerald'
		},
		{
			firstName: 'Hans',
			lastName: 'Mueller'
		}
	];

	private _addWorker() {
		this._workerData = [ ...this._workerData, this._state ];
		this._state = { ...this._state, ...defaultForm };
		this.invalidate();
	}

	private _onFormInput(data: any) {
		this._state = { ...this._state, ...data };
		this.invalidate();
	}

	protected render(): DNode {
		console.log('render');
		return v('div', [
			w(Banner, {}),
			w(WorkerForm, {
				formData: <WorkerFormData> this._state,
				onFormInput: this._onFormInput,
				onFormSave: this._addWorker
			}),
			w(WorkerContainer, {
				workerData: this._workerData
			})
		]);
	}
}
