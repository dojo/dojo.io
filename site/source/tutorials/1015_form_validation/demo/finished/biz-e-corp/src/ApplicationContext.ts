import { deepAssign } from '@dojo/framework/core/util';

import { WorkerProperties } from './widgets/Worker';
import { WorkerFormData, WorkerFormErrors } from './widgets/WorkerForm';

export default class ApplicationContext {

	private _workerData: WorkerProperties[];

	private _formData: Partial<WorkerFormData> = {};

	private _invalidator: () => void;

	private _formErrors: WorkerFormErrors = {};

	constructor(invalidator: () => void, workerData: WorkerProperties[] = []) {
		this._workerData = workerData;
		this._invalidator = invalidator;
	}

	get workerData(): WorkerProperties[] {
		return this._workerData;
	}

	get formData(): Partial<WorkerFormData> {
		return this._formData;
	}

	get formErrors(): WorkerFormErrors {
		return this._formErrors;
	}

	private _validateInput(input: Partial<WorkerFormData>): WorkerFormErrors {
		const errors: WorkerFormErrors = {};

		// validate input
		for (let key in input) {
			switch (key) {
				case 'firstName':
					errors.firstName = !input.firstName;
					break;
				case 'lastName':
					errors.lastName = !input.lastName;
					break;
				case 'email':
					errors.email = !input.email || !input.email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
			}
		}

		return errors;
	}

	private _validateOnSubmit(): boolean {
		const errors = this._validateInput(this._formData);
		this._formErrors = deepAssign({ firstName: true, lastName: true, email: true }, errors);

		if (this._formErrors.firstName || this._formErrors.lastName || this._formErrors.email) {
			console.error('Form contains errors');
			return false;
		}

		for (let worker of this._workerData) {
			if (worker.email === this._formData.email) {
				console.error('Email must be unique');
				return false;
			}
		}

		return true;
	}

	public formValidate(input: Partial<WorkerFormData>): void {
		this._formErrors = deepAssign({}, this._formErrors, this._validateInput(input));
		this._invalidator();
	}

	public formInput(input: Partial<WorkerFormData>): void {
		this._formData = deepAssign({}, this._formData, input);
		this._invalidator();
	}

	public submitForm(): void {
		if (!this._validateOnSubmit()) {
			this._invalidator();
			return;
		}

		this._workerData = [ ...this._workerData, this._formData ];
		this._formData = {};
		this._formErrors = {};
		this._invalidator();
	}
}
