import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import Banner from './Banner';
import WorkerContainer from './WorkerContainer';
import { WorkerProperties } from './Worker';

export default class App extends WidgetBase {
	private _workerData: WorkerProperties[] = [
		{
			firstName: 'Tim',
			lastName: 'Jones'
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

	protected render() {
		return v('div', [
			w(Banner, {}),
			w(WorkerContainer, {
				workerData: this._workerData
			})
		]);
	}
}
