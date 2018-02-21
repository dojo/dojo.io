export interface NodeModifier {
	(node: Element): void;
}

export function place(node: Element | undefined, modifier: NodeModifier) {
	if (node) {
		modifier(node);
	}
}

export function queryExpected<T extends Element = HTMLElement>(selector: string, root: NodeSelector = document): T | undefined {
	const node = <T> root.querySelector(selector);

	if (!node) {
		console.warn(`missing ${ selector }`);
	}

	return node;
}
