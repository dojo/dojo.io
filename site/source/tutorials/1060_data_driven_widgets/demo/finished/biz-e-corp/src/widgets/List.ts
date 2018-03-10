import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import TextInput from '@dojo/widgets/text-input';
import { WorkerProperties } from './Worker';

export interface ListProperties {
	data?: WorkerProperties[];
	onInput: (value: string) => void;
	value: string;
}

export default class List extends WidgetBase<ListProperties> {
	protected onInput(value: string) {
		this.properties.onInput(value);
	}

	protected renderItems() {
		const { data = [] } = this.properties;
		return data.map((item: any, index: number) =>
			v('div', { key: index }, [ `${item.firstName} ${item.lastName}` ])
		);
	}

	protected render() {
		return v('div', [
			w(TextInput, {
				value: this.properties.value,
				onInput: this.onInput,
				placeholder: 'Filter workers...'
			}),
			v('div', this.renderItems())
		]);
	}
}
