import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { theme, ThemedMixin } from '@dojo/widget-core/mixins/Themed';

import Banner from './Banner';
import WorkerForm, { WorkerFormData } from './WorkerForm';
import { WorkerProperties } from './Worker';
import WorkerContainer from './WorkerContainer';

import workerData from './../support/workerData';

import * as css from './../styles/app.m.css';

@theme(css)
export default class App extends ThemedMixin(WidgetBase) {
	private _newWorker: Partial<WorkerFormData> = {};

	private _workerData: WorkerProperties[] = workerData;

	private _addWorker() {
		this._workerData = this._workerData.concat(this._newWorker);
		this._newWorker = {};
		this.invalidate();
	}

	private _onFormInput(data: Partial<WorkerFormData>) {
		this._newWorker = {
			...this._newWorker,
			...data
		};
		this.invalidate();
	}

	protected render() {
		return v('div', [
			w(Banner, {}),
			w(WorkerForm, {
				formData: this._newWorker,
				onFormInput: this._onFormInput,
				onFormSave: this._addWorker
			}),
			w(WorkerContainer, {
				workerData: this._workerData
			})
		]);
	}
}
