import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';
import { TypedTargetEvent } from '@dojo/widget-core/interfaces';
import TextInput from '@dojo/widgets/textinput/TextInput';
import { WorkerProperties } from './Worker';
import * as css from '../styles/dropdown.css';

export interface DropdownProperties {
	data?: WorkerProperties[];
	onInput: (value: string) => void;
	value: string;
}

const DropdownBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Dropdown extends DropdownBase<DropdownProperties> {
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
				placeholder: 'Search workers...'
			}),
			v('div', this.renderItems())
		]);
	}
}
