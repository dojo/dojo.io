import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import Button from '@dojo/widgets/button/Button';
import TextInput from '@dojo/widgets/textinput/TextInput';
import * as css from '../styles/workerForm.css';

export interface WorkerFormProperties extends ThemeableProperties {
	firstName: string;
	firstNameInvalid: boolean;
	lastName: string;
	lastNameInvalid: boolean;
	email: string;
	emailInvalid: boolean;
	onChange?(field: string, value: string): void;
	onBlur?(field: string, value: string): void;
	onSubmit?(event: Event): void;
}

export const WorkerFormBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class WorkerForm extends WorkerFormBase<WorkerFormProperties> {

	private _onSubmit(event: Event) {
		event.preventDefault();

		const { onSubmit } = this.properties;
		onSubmit && onSubmit(event);
	}

	protected render(): DNode {
		const {
			firstName,
			firstNameInvalid,
			lastName,
			lastNameInvalid,
			email,
			emailInvalid,
			onChange,
			onBlur
		} = this.properties;

		return v('form', {
			classes: this.classes(css.workerForm),
			onsubmit: this._onSubmit
		}, [
			v('fieldset', { classes: this.classes(css.nameField) }, [
				v('legend', { classes: this.classes(css.nameLabel) }, [ 'Name' ]),
				w(TextInput, {
					key: 'input1',
					invalid: <boolean> firstNameInvalid,
					label: {
						content: 'First Name',
						hidden: true
					},
					placeholder: 'Given name',
					type: 'text' as 'text',
					value: <string> firstName,
					onChange: (event: Event) => {
						const value = (<HTMLInputElement> event.target).value;
						onChange && onChange('firstName', value);
					},
					onBlur: (event: Event) => {
						const value = (<HTMLInputElement> event.target).value;
						onBlur && onBlur('firstName', value);
					}
				}),
				w(TextInput, {
					key: 'input2',
					invalid: <boolean> lastNameInvalid,
					label: {
						content: 'Last Name',
						hidden: true
					},
					placeholder: 'Family name',
					type: 'text' as 'text',
					value: <string> lastName,
					onChange: (event: Event) => {
						const value = (<HTMLInputElement> event.target).value;
						onChange && onChange('lastName', value);
					},
					onBlur: (event: Event) => {
						const value = (<HTMLInputElement> event.target).value;
						onBlur && onBlur('lastName', value);
					}
				})
			]),
			w(TextInput, {
				key: 'input3',
				invalid: <boolean> emailInvalid,
				label: 'Email address',
				type: 'email',
				value: <string> email,
				onChange: (event: Event) => {
					const value = (<HTMLInputElement> event.target).value;
					onChange && onChange('email', value);
				},
				onBlur: (event: Event) => {
					const value = (<HTMLInputElement> event.target).value;
					onBlur && onBlur('email', value);
				}
			}),
			w(Button, {
				content: 'Save',
				type: 'submit'
			})
		]);
	}
}
