import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { TypedTargetEvent } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import TextInput, { TextInputProperties } from '@dojo/widgets/textinput/TextInput';
import * as css from '../styles/workerForm.m.css';

export interface ValidatedTextInputProperties extends TextInputProperties {
	errorMessage?: string;
	onValidate?: (event: Event) => void;
}

export const ValidatedTextInputBase = ThemedMixin(WidgetBase);

@theme(css)
export default class ValidatedTextInput extends ValidatedTextInputBase<ValidatedTextInputProperties> {
	private _errorId = uuid();

	private _onBlur(event: FocusEvent) {
		const { onBlur, onValidate } = this.properties;
		onValidate && onValidate(event);
		onBlur && onBlur(event);
	}

	private _onInput(event: TypedTargetEvent<HTMLInputElement>) {
		const { invalid, onInput, onValidate } = this.properties;
		onInput && onInput(event);

		if (typeof invalid !== 'undefined') {
			onValidate && onValidate(event);
		}
	}

	protected render() {
		const {
			disabled,
			label,
			maxLength,
			minLength,
			name,
			placeholder,
			readOnly,
			required,
			type = 'text',
			value,
			invalid,
			errorMessage,
			onBlur
		} = this.properties;
		return v('div', { classes: this.theme(css.inputWrapper) }, [
			w(TextInput, {
				describedBy: this._errorId,
				disabled,
				invalid,
				label,
				maxLength,
				minLength,
				name,
				placeholder,
				readOnly,
				required,
				type,
				value,
				onBlur: typeof invalid === 'undefined' ? this._onBlur : onBlur,
				onInput: this._onInput
			}),
			invalid === true ? v('span', {
				id: this._errorId,
				classes: this.theme(css.error),
				'aria-live': 'polite'
			}, [ errorMessage ]) : null
		]);
	}
}
