import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties, TypedTargetEvent } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import Button from '@dojo/widgets/button/Button';
import TextInput from '@dojo/widgets/textinput/TextInput';
import * as css from '../styles/workerForm.css';

export interface WorkerFormData {
	firstName: string;
	lastName: string;
	email: string;
}

export interface WorkerFormProperties extends ThemeableProperties {
	formData: WorkerFormData;
	onFormInput: (data: Partial<WorkerFormData>) => void;
	onFormSave: () => void;
}

export const WorkerFormBase = ThemeableMixin(WidgetBase);

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

	protected render(): DNode {
		const {
			formData: { firstName, lastName, email }
		} = this.properties;

		return v('form', {
			classes: this.classes(css.workerForm),
			onsubmit: this._onSubmit
		}, [
			v('fieldset', { classes: this.classes(css.nameField) }, [
				v('legend', { classes: this.classes(css.nameLabel) }, [ 'Name' ]),
				w(TextInput, {
					key: 'firstNameInput',
					label: {
						content: 'First Name',
						hidden: true
					},
					placeholder: 'Given name',
					value: firstName,
					required: true,
					onInput: this.onFirstNameInput
				}),
				w(TextInput, {
					key: 'lastNameInput',
					label: {
						content: 'Last Name',
						hidden: true
					},
					placeholder: 'Surname name',
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
			w(Button, { content: 'Save' })
		]);
	}
}
