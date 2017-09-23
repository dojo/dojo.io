import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { WorkerProperties } from './Worker';
import Dropdown from './Dropdown';

export interface BannerProperties {
	data?: WorkerProperties[];
}

export default class Banner extends WidgetBase<BannerProperties> {
	private _data: any[] = [];

	protected filterData(value: string) {
		const { data = [] } = this.properties;

		this._data = data.filter((item: WorkerProperties) => {
			const name = `${item.firstName} ${item.lastName}`;
			const match = name.toLowerCase().match(new RegExp(`^${value.toLowerCase()}`));
			return Boolean(match && match.length > 0);
		});

		this.invalidate();
	}

	protected render() {
		return [
			v('h1', { title: 'I am a title!' }, [ 'Welcome To Biz-E-Bodies' ]),
			v('label', ['Find a worker:']),
			w(Dropdown, {
				onInput: this.filterData,
				value: '',
				data: this._data
			})
		];
	}
}
