import { deepAssign } from '@dojo/framework/core/util';

import { WorkerProperties } from './widgets/Worker';
import { WorkerFormData } from './widgets/WorkerForm';

export default class ApplicationContext {

	private _workerData: WorkerProperties[];

	private _formData: Partial<WorkerFormData> = {};

	private _invalidator: () => void;

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

	public formInput(input: Partial<WorkerFormData>): void {
		this._formData = deepAssign({}, this._formData, input);
		this._invalidator();
	}

	public submitForm(): void {
		this._workerData = [ ...this._workerData, this._formData ];
		this._formData = {};
		this._invalidator();
	}
}
