import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import Button from '@dojo/widgets/button/Button';
import Banner from './Banner';
import WorkerForm from './WorkerForm';
import { WorkerProperties } from './Worker';
import WorkerContainer from './WorkerContainer';

export const AppBase = StatefulMixin(WidgetBase);

export default class App extends AppBase<WidgetProperties> {
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
		const {
			formData = {}
		} = this.state;

		const {
			firstNameInvalid = true,
			lastNameInvalid = true,
			emailInvalid = true
		} = formData;

		if (!firstNameInvalid && !lastNameInvalid && !emailInvalid) {
			// add worker to array
			this._workerData.push({ 'firstName': formData.firstName, 'lastName': formData.lastName, 'email': formData.email });
			// clear form values
			this.setState({ 'formData': undefined });
			// trigger re-render
			this.invalidate();
		}
		else {
			console.warn('Looks like the form was incomplete or contained errors.');
		}
	}

	private _validateWorkerData(field: string, value: string) {
		switch (field) {
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
		const {
			formData = {}
		} = this.state;

		return v('div', [
			w(Banner, {}),
			w(WorkerForm, {
				firstName: <string> formData.firstName,
				firstNameInvalid: <boolean> formData.firstNameInvalid,
				lastName: <string> formData.lastName,
				lastNameInvalid: <boolean> formData.lastNameInvalid,
				email: <string> formData.email,
				emailInvalid: <boolean> formData.emailInvalid,
				onChange: (field: string, value: string) => {
					this.setState({
						'formData': {
							...this.state.formData,
							[field]: value
						}
					});
				},
				onBlur: (field: string, value: string) => {
					const isValid = this._validateWorkerData(field, value);
					this.setState({
						'formData': {
							...this.state.formData,
							[field + 'Invalid']: !isValid
						}
					});
				},
				onSubmit: this._addWorker
			}),
			w(WorkerContainer, {
				workerData: this._workerData
			})
		]);
	}
}
