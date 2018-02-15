import { DocSetId, DocType, PageId, isValidPageId } from './docs';

/**
 * Create a link hash for a given docset
 *
 * The hash has the following format:
 *
 *     <project>/<version>/<type>/<page>/<section>
 */
export function createHash(id: (DocSetId & { type: DocType }) | PageId) {
	const parts = [id.project, id.version, id.type];
	if (isValidPageId(id)) {
		parts.push(id.page);
		if (id.section) {
			parts.push(id.section);
		}
	}
	return '#' + parts.map(encodeURIComponent).join('/');
}

/**
 * Parse the hash into a DocId
 */
export function parseHash() {
	const hash = location.hash.slice(1);
	let [project, version, type, page, section] = hash
		.split('/')
		.map(part => decodeURIComponent(part));
	return <PageId>{ project, version, type, page, section };
}

/**
 * Push a new URL onto the history stack.
 *
 * By default this function replaces the current URL. Set `push` to true to
 * push the new URL onto the stack instead.
 */
export function updateHash(
	newHash: string | PageId | (DocSetId & { type: DocType }),
	event = HashEvent.nav
) {
	let hash = typeof newHash === 'string' ? newHash : createHash(newHash);
	if (location.hash === hash) {
		return;
	}

	const state = { event };

	if (event === HashEvent.rename) {
		history.replaceState(state, '', hash);
	} else if (
		event === HashEvent.nav ||
		(!history.state || history.state.event !== event)
	) {
		history.pushState(state, '', hash);
	} else {
		history.replaceState(state, '', hash);
	}
}

export enum HashEvent {
	// nav actions like norml navigation -- a new entry is pushed onto the
	// stack
	nav = 'nav',

	// rename replaces the top entry on the stack
	rename = 'rename',

	// scroll initially pushes, then replaces as long as scroll updates are
	// received
	scroll = 'scroll'
}
