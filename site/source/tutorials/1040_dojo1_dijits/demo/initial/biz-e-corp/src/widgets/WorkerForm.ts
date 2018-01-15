import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
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

	protected onFirstNameInput(event: KeyboardEvent) {
		const { value: firstName } = event.target as HTMLInputElement;
		this.properties.onFormInput({ firstName });
	}

	protected onLastNameInput(event: KeyboardEvent) {
		const { value: lastName } = event.target as HTMLInputElement;
		this.properties.onFormInput({ lastName });
	}

	protected onEmailInput(event: KeyboardEvent) {
		const { value: email } = event.target as HTMLInputElement;
		this.properties.onFormInput({ email });
	}

	protected render() {
		return v('form', {
			classes: this.theme(css.workerForm),
			onsubmit: this._onSubmit
		}, [ ]);
	}
}
