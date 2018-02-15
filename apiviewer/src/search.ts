import * as h from 'hyperscript';
import * as Mark from 'mark.js';

import { DocType, getDocSet, getCurrentDocSetId } from './docs';
import { createLinkItem } from './render';

const maxSnippetLength = 60;
const minSearchTermLength = 4;

/**
 * Search the loaded docset for a given string. Update the search results
 * box with the results.
 */
export default function search(
	term: string,
	docType: DocType,
	results: Element | string
) {
	const searchResults =
		typeof results === 'string'
			? document.querySelector(results)!
			: results;
	searchResults.innerHTML = '';

	const highlightTerm = term.trim();
	const searchTerm = highlightTerm.toLowerCase();

	if (searchTerm && searchTerm.length < minSearchTermLength) {
		return;
	}

	const docSetId = getCurrentDocSetId();
	const docs = getDocSet(docSetId);
	const pages = docType === 'api' ? docs.apiPages! : docs.pages;
	const cache = docType === 'api' ? docs.apiCache! : docs.pageCache!;
	const finders: PromiseLike<any>[] = [];

	for (let name of pages) {
		const page = cache[name];
		finders.push(
			findAllMatches(searchTerm, page.element).then(matches => {
				if (matches.length > 0) {
					const link = createLinkItem(page.title, {
						page: name,
						type: docType,
						...docSetId
					});

					const submenu = h(
						'ul',
						{},
						matches.map(match => {
							return createLinkItem(match.snippet, {
								type: docType,
								page: name,
								section: match.section,
								...docSetId
							});
						})
					);

					link.appendChild(submenu);
					searchResults.appendChild(link);
				}
			})
		);
	}

	Promise.all(finders).then(() => {
		if (searchResults.childNodes.length === 0) {
			if (searchTerm) {
				searchResults.innerHTML =
					'<li class="no-results">No results found</li>';
			}
		} else {
			// Run the finder over the search results to make the searched
			// word easier to see.
			findAllMatches(searchTerm, searchResults, false);
		}
	});
}

/**
 * Find all the matches for the user's text
 */
function findAllMatches(
	searchTerm: string,
	page: Element,
	saveMatches = true
): Promise<SearchResult[]> {
	return new Promise(resolve => {
		const highlighter = new Mark(page);
		highlighter.unmark();

		const matches: SearchResult[] = [];
		highlighter.mark(searchTerm, {
			acrossElements: true,
			caseSensitive: false,
			ignorePunctuation: ['“', '”', '‘', '’'],
			separateWordSearch: false,
			each: (element: Element) => {
				if (saveMatches) {
					element.id = `search-result-${matches.length}`;
					matches.push({
						element,
						section: element.id,
						snippet: createSnippet(element)
					});
				}
			},
			done: () => {
				resolve(matches);
			}
		});
	});
}

/**
 * Get some text surrounding a search match
 */
function createSnippet(searchMatch: Element) {
	const searchText = searchMatch.textContent!;
	const container = getContainer(searchMatch);
	const extraLength = maxSnippetLength - searchText.length;

	const previousSibling = (node: HTMLElement) => node.previousSibling;
	let previousText = '';
	let previous = getNextTextNode(searchMatch, previousSibling, getRightLeaf);
	while (previous && previousText.length < extraLength) {
		previousText = previous.textContent! + previousText;
		previous = getNextTextNode(previous, previousSibling, getRightLeaf)!;
	}

	const nextSibling = (node: HTMLElement) => node.nextSibling;
	let nextText = '';
	let next = getNextTextNode(searchMatch, nextSibling, getLeftLeaf);
	while (next && nextText.length < extraLength) {
		nextText += next.textContent!;
		next = getNextTextNode(next, nextSibling, getLeftLeaf);
	}

	const halfExtra = extraLength / 2;
	let nextTarget = halfExtra;
	let prevTarget = halfExtra;
	if (nextText.length > halfExtra && previousText.length > halfExtra) {
		nextTarget = halfExtra;
		prevTarget = halfExtra;
	} else if (nextText.length > halfExtra) {
		nextTarget = halfExtra + (halfExtra - previousText.length);
	} else if (previousText.length > halfExtra) {
		prevTarget = halfExtra + (halfExtra - nextText.length);
	}

	if (previousText.length > prevTarget) {
		previousText = `...${previousText.slice(
			previousText.length - prevTarget
		)}`;
	}
	if (nextText.length > nextTarget) {
		nextText = `${nextText.slice(0, nextTarget)}...`;
	}

	return [previousText, searchText, nextText].join('');

	// Get the next (or previous) text node from a given node. This may
	// involve some traversal of the DOM.
	function getNextTextNode(
		node: Node | null,
		getNext: (node: Node) => Node | null,
		getLeaf: (node: Node) => Node | null
	): Node | null {
		if (!node || node === container) {
			return null;
		}

		let next = getNext(node);
		if (!next) {
			return getNextTextNode(node.parentElement, getNext, getLeaf);
		}

		if (next.childNodes.length > 0) {
			next = getLeaf(next);
		}

		if (next && next.nodeType !== Node.TEXT_NODE) {
			return getNextTextNode(next, getNext, getLeaf);
		}

		return next;
	}

	// Get the leftmost leaf in the DOM, starting from a given node
	function getLeftLeaf(node: Node): Node {
		while (node.childNodes.length > 0) {
			return getLeftLeaf(node.childNodes[0]);
		}
		return node;
	}

	// Get the rightmost leaf in the DOM, starting from a given node
	function getRightLeaf(node: Node): Node {
		while (node.childNodes.length > 0) {
			return getRightLeaf(node.childNodes[node.childNodes.length - 1]);
		}
		return node;
	}

	// Get the container for an element. This is just the first
	// 'interesting' container in its ancestry tree.
	function getContainer(node: Element): Element {
		switch (node.tagName) {
			case 'H1':
			case 'H2':
			case 'H3':
			case 'H4':
			case 'P':
			case 'BLOCKQUOTE':
			case 'PRE':
			case 'LI':
			case 'TR':
			case 'TABLE':
				return node;
			default:
				return getContainer(node.parentElement!);
		}
	}
}

interface SearchResult {
	element: Element;
	section?: string;
	snippet: string;
}
