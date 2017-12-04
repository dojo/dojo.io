import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { TypedTargetEvent } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import Button from '@dojo/widgets/button/Button';
import ValidatedTextInput from './ValidatedTextInput';
import * as css from '../styles/workerForm.css';

export interface WorkerFormData {
	firstName: string;
	lastName: string;
	email: string;
}

export interface WorkerFormErrors {
	firstName?: boolean;
	lastName?: boolean;
	email?: boolean;
}

export interface WorkerFormProperties {
	formData: WorkerFormData;
	formErrors: WorkerFormErrors;
	onFormInput: (data: Partial<WorkerFormData>) => void;
	onFormValidate: (data: Partial<WorkerFormData>) => void;
	onFormSave: () => void;
}

export const WorkerFormBase = ThemedMixin(WidgetBase);

@theme(css)
export default class WorkerForm extends WorkerFormBase<WorkerFormProperties> {

	private _onSubmit(event: Event) {
		event.preventDefault();
		this.properties.onFormSave();
	}

	protected onFirstNameInput({ target: { value: firstName } }: TypedTargetEvent<HTMLInputElement>) {
		this.properties.onFormInput({ firstName });
	}

	protected onLastNameInput({ target: { value: lastName } }: TypedTargetEvent<HTMLInputElement>) {
		this.properties.onFormInput({ lastName });
	}

	protected onEmailInput({ target: { value: email } }: TypedTargetEvent<HTMLInputElement>) {
		this.properties.onFormInput({ email });
	}

	protected onFirstNameValidate({ target: { value: firstName } }: TypedTargetEvent<HTMLInputElement>) {
		this.properties.onFormValidate({ firstName });
	}

	protected onLastNameValidate({ target: { value: lastName } }: TypedTargetEvent<HTMLInputElement>) {
		this.properties.onFormValidate({ lastName });
	}

	protected onEmailValidate({ target: { value: email } }: TypedTargetEvent<HTMLInputElement>) {
		this.properties.onFormValidate({ email });
	}

	protected render() {
		const {
			formData: { firstName, lastName, email },
			formErrors
		} = this.properties;

		return v('form', {
			classes: this.theme(css.workerForm),
			novalidate: 'true',
			onsubmit: this._onSubmit
		}, [
			v('fieldset', { classes: this.theme(css.nameField) }, [
				v('legend', { classes: this.theme(css.nameLabel) }, [ 'Name' ]),
				w(ValidatedTextInput, {
					key: 'firstNameInput',
					label: {
						content: 'First Name',
						hidden: true
					},
					placeholder: 'Given name',
					value: firstName,
					required: true,
					onInput: this.onFirstNameInput,
					onValidate: this.onFirstNameValidate,
					invalid: formErrors.firstName,
					errorMessage: 'First name is required'
				}),
				w(ValidatedTextInput, {
					key: 'lastNameInput',
					label: {
						content: 'Last Name',
						hidden: true
					},
					placeholder: 'Surname name',
					value: lastName,
					required: true,
					onInput: this.onLastNameInput,
					onValidate: this.onLastNameValidate,
					invalid: formErrors.lastName,
					errorMessage: 'Last name is required'
				})
			]),
			w(ValidatedTextInput, {
				label: 'Email address',
				type: 'email',
				value: email,
				required: true,
				onInput: this.onEmailInput,
				onValidate: this.onEmailValidate,
				invalid: formErrors.email,
				errorMessage: 'Please enter a valid email address'
			}),
			w(Button, {}, [ 'Save' ])
		]);
	}
}
