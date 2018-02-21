declare module 'mark.js' {
	interface Range {
		start: number;
		length: number;
	}

	type Accuracy = 'partially' | 'complimentary' | 'exactly';

	interface Options {
		element: string;
		className: string;
		exclude: string[];
		iframes: boolean;
		iframesTimeout: number;
		acrossElements: boolean;
		each: (element: HTMLElement) => void;
		noMatch: (term: string) => void;
		done: (totalMarks: number) => void;
		debug: boolean;
		log: Console;
	}

	interface MarkOptions extends Options {
		separateWordSearch: boolean;
		accuracy: Accuracy | { value: Accuracy; limiters: string[] };
		diacritics: boolean;
		synonyms: { [word: string]: string[] };
		caseSensitive: boolean;
		ignoreJoiners: boolean;
		ignorePunctuation: string[];
		wildcards: string;
		filter: (node: Node, term: string, totalMarks: number, termMarks: number) => void;
	}

	interface RegExpOptions extends Options {
		ignoreGroups: number;
		filter: (node: Node, match: string, totalMarks: number) => void;
	}

	interface RangeOptions extends Options {
		filter: (node: Node, range: Range, term: string, totalMarks: number) => void;
	}

	interface Mark {
		new (context: Element | Element[] | NodeList | string): Mark;
		mark(keywords: string | string[], options?: Partial<MarkOptions>): Mark;
		markRegExp(regexp: RegExp, options?: Partial<RegExpOptions>): Mark;
		markRanges(ranges: Range[], options?: Partial<RangeOptions>): Mark;
		unmark(): Mark;
	}

	const m: Mark;
	export = m;
}
