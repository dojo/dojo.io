import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import Button, { ButtonProperties } from '@dojo/widgets/button/Button';
import TextInput, { TextInputProperties } from '@dojo/widgets/textinput/TextInput';
import { WorkerProperties } from './Worker';
import * as styles from '../styles/workerForm.css';

export interface WorkerFormProperties extends ThemeableProperties {
	validateField?(field: string, value: string): boolean;
	onSubmit?(worker: WorkerProperties): void;
}

export const WorkerFormBase = StatefulMixin(ThemeableMixin(WidgetBase));

@theme(styles)
export default class WorkerForm extends WorkerFormBase<WorkerFormProperties> {
	private _clearValues() {
		for (let field in this.state) {
			this.setState({ [field]: undefined });
		}
	}

	private _onSubmit(event: Event) {
		event.preventDefault();

		const {
			onSubmit,
			validateField = () => true
		} = this.properties;

		const {
			firstName,
			lastName,
			email
		} = this.state;

		let validated = true;
		for (const field of ['firstName', 'lastName', 'email']) {
			if (!validateField(field, this.state[field])) {
				validated = false;
				break;
			}
		}

		if (validated) {
			onSubmit && onSubmit({ firstName, lastName, email });
			this._clearValues();
		}
		else {
			console.warn('There were errors in the form. Please check all fields and try again');
		}
	}

	render() {
		const {
			validateField = () => true
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
					invalid: <boolean> this.state.firstNameInvalid,
					placeholder: 'Given name',
					value: <string> this.state.firstName,
					onChange: (event: Event) => this.setState({ 'firstName': (<HTMLInputElement> event.target).value }),
					onBlur: (event: Event) => {
						const value = (<HTMLInputElement> event.target).value;
						this.setState({ 'firstNameInvalid': !validateField('firstName', value) });
					}
				}),
				w<TextInputProperties>(TextInput, {
					key: 'input2',
					type: 'text' as 'text',
					label: {
						content: 'Last Name',
						hidden: true
					},
					invalid: <boolean> this.state.lastNameInvalid,
					placeholder: 'Family name',
					value: <string> this.state.lastName,
					onChange: (event: Event) => this.setState({ 'lastName': (<HTMLInputElement> event.target).value }),
					onBlur: (event: Event) => {
						const value = (<HTMLInputElement> event.target).value;
						this.setState({ 'lastNameInvalid': !validateField('lastName', value) });
					}
				}),
			]),
			w<TextInputProperties>(TextInput, {
				key: 'input3',
				type: 'email',
				label: 'Email address',
				invalid: <boolean> this.state.emailInvalid,
				value: <string> this.state.email,
				onChange: (event: Event) => this.setState({ 'email': (<HTMLInputElement> event.target).value }),
				onBlur: (event: Event) => {
					const value = (<HTMLInputElement> event.target).value;
					this.setState({ 'emailInvalid': !validateField('email', value) });
				}
			}),
			w<ButtonProperties>(Button, {
				content: 'Save',
				type: 'submit'
			})
		]);
	}
}
