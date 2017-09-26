import { deepAssign } from '@dojo/core/lang';
import { Injector } from '@dojo/widget-core/Injector';

import { WorkerProperties } from './widgets/Worker';
import { WorkerFormData } from './widgets/WorkerForm';

export default class ApplicationContext extends Injector {

	private _workerData: WorkerProperties[];

	private _formData: Partial<WorkerFormData> = {};

	constructor(workerData: WorkerProperties[] = []) {
		super({});
		this._workerData = workerData;
	}

	get workerData(): WorkerProperties[] {
		return this._workerData;
	}

	get formData(): Partial<WorkerFormData> {
		return this._formData;
	}

	public formInput(input: Partial<WorkerFormData>): void {
		this._formData = deepAssign({}, this._formData, input);
		this.emit({ type: 'invalidate' });
	}

	public submitForm(): void {
		this._workerData = [ ...this._workerData, this._formData ];
		this._formData = {};
		this.emit({ type: 'invalidate' });
	}

	get(): ApplicationContext {
		return this;
	}
}
