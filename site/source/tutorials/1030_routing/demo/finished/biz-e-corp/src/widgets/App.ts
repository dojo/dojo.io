import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';
import { Link } from '@dojo/routing/Link';

import { WorkerFormData } from './WorkerForm';
import { WorkerProperties } from './Worker';
import WorkerFormOutlet from './../outlets/WorkerFormOutlet';
import WorkerContainerOutlet from './../outlets/WorkerContainerOutlet';
import FilteredWorkerContainerOutlet from './../outlets/FilteredWorkerContainerOutlet';
import BannerOutlet from './../outlets/BannerOutlet';

import workerData from './../support/workerData';

import * as css from './../styles/app.m.css';

@theme(css)
export default class App extends ThemeableMixin(WidgetBase) {
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
			v('div', { classes: this.classes(css.root) },  [
				v('div', { classes: this.classes(css.container) },  [
					v('h1', { classes: this.classes(css.title) }, [ 'Biz-E-Bodies' ]),
					v('div', { classes: this.classes(css.links) }, [
						w(Link, { key: 'home', to: 'home', classes: this.classes(css.link) }, [ 'Home' ]),
						w(Link, { key: 'directory', to: 'directory', classes: this.classes(css.link) }, [ 'Worker Directory' ]),
						w(Link, { key: 'newWorker', to: 'new-worker', classes: this.classes(css.link) }, [ 'New Worker' ])
					])
				])
			]),
			v('div', { classes: this.classes(css.main) },  [
				w(BannerOutlet, {}),
				w(WorkerFormOutlet, {
					formData: this._newWorker,
					onFormInput: this._onFormInput,
					onFormSave: this._addWorker
				}),
				w(FilteredWorkerContainerOutlet, {
					workerData: this._workerData
				}),
				w(WorkerContainerOutlet, {
					workerData: this._workerData
				})
			])
		]);
	}
}
