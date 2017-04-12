import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import Button from '@dojo/widgets/button/Button';
import Banner from './Banner';
import WorkerForm from './WorkerForm';
import { WorkerProperties } from './Worker';
import WorkerContainer from './WorkerContainer';

export default class App extends WidgetBase<WidgetProperties> {
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

	private _addWorker(worker: WorkerProperties) {
		this._workerData.push(worker);
		this.invalidate();
	}

	private _validateWorkerData(field: string, value: string) {
		switch(field) {
			case 'firstName':
			case 'lastName':
				return typeof value !== 'undefined' && value.length > 0;

			case 'email':
				let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(value);

			default:
				return true;
		}
	}

	render(): DNode {
		return v('div', [
			w(Banner, {}),
			w(WorkerForm, {
				onSubmit: this._addWorker,
				validateField: this._validateWorkerData
			}),
			w(WorkerContainer, {
				workerData: this._workerData
			})
		]);
	}
}
