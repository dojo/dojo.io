import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { TypedTargetEvent } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import * as css from '../styles/workerForm.css';

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

	protected render() {
		return v('form', {
			classes: this.classes(css.workerForm),
			onsubmit: this._onSubmit
		}, [ ]);
	}
}
