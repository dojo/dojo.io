import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import { ThemedMixin, theme } from '@dojo/framework/widget-core/mixins/Themed';
import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';
import * as css from '../styles/workerForm.m.css';

export interface WorkerFormData {
	firstName: string;
	lastName: string;
	email: string;
}

export interface WorkerFormProperties {
	formData: WorkerFormData;
	onFormInput: (data: Partial<WorkerFormData>) => void;
	onFormSave: () => void;
}

@theme(css)
export default class WorkerForm extends ThemedMixin(WidgetBase)<WorkerFormProperties> {

	private _onSubmit(event: Event) {
		event.preventDefault();
		this.properties.onFormSave();
	}

	protected onFirstNameInput(firstName: string) {
		this.properties.onFormInput({ firstName });
	}

	protected onLastNameInput(lastName: string) {
		this.properties.onFormInput({ lastName });
	}

	protected onEmailInput(email: string) {
		this.properties.onFormInput({ email });
	}

	protected render() {
		const {
			formData: { firstName, lastName, email }
		} = this.properties;

		return v('form', {
			classes: this.theme(css.workerForm),
			onsubmit: this._onSubmit
		}, [
			v('fieldset', { classes: this.theme(css.nameField) }, [
				v('legend', { classes: this.theme(css.nameLabel) }, [ 'Name' ]),
				w(TextInput, {
					key: 'firstNameInput',
					label: 'First Name',
					labelHidden: true,
					placeholder: 'First name',
					value: firstName,
					required: true,
					onInput: this.onFirstNameInput
				}),
				w(TextInput, {
					key: 'lastNameInput',
					label: 'Last Name',
					labelHidden: true,
					placeholder: 'Last name',
					value: lastName,
					required: true,
					onInput: this.onLastNameInput
				})
			]),
			w(TextInput, {
				label: 'Email address',
				type: 'email',
				value: email,
				required: true,
				onInput: this.onEmailInput
			}),
			w(Button, {}, [ 'Save' ])
		]);
	}
}
