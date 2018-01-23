import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import Fieldset from '../dijit/Fieldset';
import Button from '../dijit/form/Button';
import TextBox from '../dijit/form/TextBox';
import * as css from '../styles/workerForm.m.css';

export interface WorkerFormData {
	firstName: string;
	lastName: string;
	email: string;
}

export interface WorkerFormProperties {
	formData: Partial<WorkerFormData>;
	onFormInput: (data: Partial<WorkerFormData>) => void;
	onFormSave: () => void;
}

export const WorkerFormBase = ThemedMixin(WidgetBase);

@theme(css)
export default class WorkerForm extends WorkerFormBase<WorkerFormProperties> {

	private _onSubmit(event: Event) {
		event.preventDefault();
		this.properties.onFormSave();
	}

	protected onFirstNameInput(event: KeyboardEvent & DocumentEvent) {
		const { value: firstName } = event.target as HTMLInputElement;
		this.properties.onFormInput({ firstName });
	}

	protected onLastNameInput(event: KeyboardEvent & DocumentEvent) {
		const { value: lastName } = event.target as HTMLInputElement;
		this.properties.onFormInput({ lastName });
	}

	protected onEmailInput(event: KeyboardEvent & DocumentEvent) {
		const { value: email } = event.target as HTMLInputElement;
		this.properties.onFormInput({ email });
	}

	protected render() {
		return v('form', {
			classes: this.theme(css.workerForm),
			onsubmit: this._onSubmit
		}, [
			w(Fieldset, {
				title: 'Name'
			}, [
				w(TextBox, {
					key: 'firstNameInput',
					placeHolder: 'First name',
					onInput: this.onFirstNameInput
				}),
				w(TextBox, {
					key: 'lastNameInput',
					placeHolder: 'Last name',
					onInput: this.onLastNameInput
				})
			]),
			w(TextBox, {
				key: 'emailAddress',
				placeHolder: 'Email address',
				type: 'email',
				onInput: this.onEmailInput
			}),
			w(Button, {
				class: css.workerButton,
				label: 'Save',
				type: 'submit'
			})
		]);
	}
}
