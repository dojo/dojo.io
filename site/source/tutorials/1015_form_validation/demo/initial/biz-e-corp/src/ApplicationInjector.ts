import { Injector } from '@dojo/widget-core/Injector';
import ApplicationContext from './ApplicationContext';

export default class ApplicationInjector extends Injector {
	constructor(payload: ApplicationContext) {
		super(payload);
		payload.on('invalidate', () => {
			this.emit({ type: 'invalidate' });
		});
	}
}
