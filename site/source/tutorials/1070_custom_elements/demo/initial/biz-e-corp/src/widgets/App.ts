import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import { ThemedMixin } from '@dojo/framework/widget-core/mixins/Themed';
import WorkerProfile from './WorkerProfile';

export default class App extends ThemedMixin(WidgetBase) {
	protected render() {
		return v('div', [
			w(WorkerProfile, {
				firstName: 'Joe',
				lastName: 'Bloggs',
				email: 'joebloggs@bizecorp.com',
				timePerTask: 10,
				tasks: ['Being real busy']
			}, [])
		]);
	}
}
