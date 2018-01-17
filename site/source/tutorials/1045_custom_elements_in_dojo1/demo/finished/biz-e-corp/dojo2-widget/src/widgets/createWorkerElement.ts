import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import Worker from './Worker';

export default function createMenuElement(): CustomElementDescriptor {
	return {
		tagName: 'myapp-worker',
		widgetConstructor: Worker,
		attributes: [
			{ attributeName: 'firstName' },
			{ attributeName: 'lastName' }
		]
	};
};
