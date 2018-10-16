import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import { theme, ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import { Link } from '@dojo/framework/routing/Link';
import { Outlet } from '@dojo/framework/routing/Outlet';
import { MatchDetails } from '@dojo/framework/routing/interfaces';

import { WorkerFormData } from './WorkerForm';
import { WorkerProperties } from './Worker';
import Banner from './Banner';
import WorkerForm from './../widgets/WorkerForm';
import WorkerContainer from './../widgets/WorkerContainer';

import workerData from './../support/workerData';

import * as css from './../styles/app.m.css';

@theme(css)
export default class App extends ThemedMixin(WidgetBase) {
	private _newWorker: Partial<WorkerFormData> = {};

	private _workerData: WorkerProperties[] = workerData;

	private _addWorker = () => {
		this._workerData = this._workerData.concat(this._newWorker);
		this._newWorker = {};
		this.invalidate();
	}

	private _onFormInput = (data: Partial<WorkerFormData>) => {
		this._newWorker = {
			...this._newWorker,
			...data
		};
		this.invalidate();
	}

	protected render() {
		return v('div', [
			v('div', { classes: this.theme(css.root) },  [
				v('div', { classes: this.theme(css.container) },  [
					v('h1', { classes: this.theme(css.title) }, [ 'Biz-E-Bodies' ]),
					v('div', { classes: this.theme(css.links) }, [
						w(Link, { key: 'home', to: 'home', classes: this.theme(css.link) }, [ 'Home' ]),
						w(Link, { key: 'directory', to: 'directory', classes: this.theme(css.link) }, [ 'Worker Directory' ]),
						w(Link, { key: 'newWorker', to: 'new-worker', classes: this.theme(css.link) }, [ 'New Worker' ])
					])
				])
			]),
			w(Outlet, { id: 'home', renderer: () => {
				return w(Banner, {
					data: this._workerData
				});
			}}),
			w(Outlet, { id: 'new-worker', renderer: () => {
				return w(WorkerForm, {
					formData: this._newWorker,
					onFormInput: this._onFormInput,
					onFormSave: this._addWorker
				});
			}}),
			w(Outlet, { id: 'filter', renderer: (matchDetails: MatchDetails) => {
				if (matchDetails.isExact()) {
					return w(WorkerContainer, {
						workerData: this._workerData,
						filter: matchDetails.params.filter
					});
				}
				return w(WorkerContainer, { workerData: this._workerData });
			}})
		]);
	}
}
