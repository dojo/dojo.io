import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import Button, { ButtonProperties } from '@dojo/widgets/button/Button';
import TextInput, { TextInputProperties } from '@dojo/widgets/textinput/TextInput';
import { WorkerProperties } from './Worker';
import * as styles from '../styles/workerForm.css';

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

@theme(styles)
export default class WorkerForm extends WorkerFormBase<WorkerFormProperties> {

	private _onSubmit(event: Event) {
		event.preventDefault();

		const { onSubmit } = this.properties;
		onSubmit && onSubmit(event);
	}

	render() {
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
			classes: this.classes(styles.workerForm),
			onsubmit: this._onSubmit
		}, [
			v('fieldset', { classes: this.classes(styles.nameField) }, [
				v('legend', { classes: this.classes(styles.nameLabel) }, [ 'Name' ]),
				w<TextInputProperties>(TextInput, {
					key: 'input1',
					type: 'text' as 'text',
					label: {
						content: 'First Name',
						hidden: true
					},
					invalid: <boolean> firstNameInvalid,
					placeholder: 'Given name',
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
				w<TextInputProperties>(TextInput, {
					key: 'input2',
					type: 'text' as 'text',
					label: {
						content: 'Last Name',
						hidden: true
					},
					invalid: <boolean> lastNameInvalid,
					placeholder: 'Family name',
					value: <string> lastName,
					onChange: (event: Event) => {
						const value = (<HTMLInputElement> event.target).value;
						onChange && onChange('lastName', value);
					},
					onBlur: (event: Event) => {
						const value = (<HTMLInputElement> event.target).value;
						onBlur && onBlur('lastName', value);
					}
				}),
			]),
			w<TextInputProperties>(TextInput, {
				key: 'input3',
				type: 'email',
				label: 'Email address',
				invalid: <boolean> emailInvalid,
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
			w<ButtonProperties>(Button, {
				content: 'Save',
				type: 'submit'
			})
		]);
	}
}
