import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';
import TextInput from '@dojo/widgets/textinput/TextInput';
import { WorkerProperties } from './Worker';
import * as css from '../styles/list.m.css';

export interface ListProperties {
	data?: WorkerProperties[];
	onInput: (value: string) => void;
	value: string;
}

const ListBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class List extends ListBase<ListProperties> {
	protected onInput({ target: { value } }: any) {
		this.properties.onInput(value);
	}

	protected renderItems() {
		const { data = [] } = this.properties;
		return data.map((item: any) => v('div', [ `${item.firstName} ${item.lastName}` ]));
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
