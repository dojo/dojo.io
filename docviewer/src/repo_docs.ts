import * as h from 'hyperscript';
import {
	docFetch,
	fromHash,
	global,
	isSameDoc,
	scrollTo,
	toHash,
	DocSet,
	DocType,
	LocationRef
} from './common';
import renderDoc from './render_doc';
import renderApi from './render_api';

// The list of hash addresses of available top-level docs
const docs: { [pkg: string]: string } = {};

// A cache of loaded docset metadata
const docsetCache: {
	[hash: string]: DocSet;
} = Object.create(null);

// The hash address of the currently visible doc
let currentDoc: string;

// Get the doc container based on the location of this script in the DOM
const docContainer = document.querySelector('.docs .doc-detail');
const tocContainer = document.querySelector('.docs .sidebar-right');
const sidebar = document.querySelector('.sidebar-left');
const docSelector = sidebar.querySelector('.uk-nav');
const mobileMedia = window.matchMedia('(max-width: 960px)');

init();

/**
 * Initialize the viewer
 */
function init() {
	// Keep a list of the available top-level docs
	const links = docSelector.querySelectorAll('a');
	for (const link of links) {
		const pkg = link.getAttribute('data-package');
		docs[pkg] = link.getAttribute('href');
	}

	// Update the UI when the viewport changes size
	mobileMedia.addListener(event => {
		if (event.matches) {
			handleMobile();
		} else {
			handleDesktop();
		}
	});

	// Handle left nav link clicks
	docSelector.addEventListener('click', handleDocSelectorClick);

	window.addEventListener('hashchange', event => {
		event.preventDefault();
		handleHashChange(location.hash);
	});

	// Handle in-page heading clicks
	docContainer.addEventListener('click', handleHeadingClick);

	// UIkit will emit a 'scrolled' event when an anchor has been scrolled
	// to using UIkit's scrolling functionality
	document.body.addEventListener('scrolled', handleScrolled);

	// Update the UI to match the current viewport
	if (mobileMedia.matches) {
		handleMobile();
	} else {
		handleDesktop();
	}

	// If the current path is a doc link, load the referenced doc
	const ref = fromHash(location.hash);
	if (ref) {
		setDocType(ref.type);
		handleHashChange(location.hash);
	} else {
		setDocType('doc');
	}
}

/**
 * Handle a browser hash change
 */
async function handleHashChange(hash: string) {
	const docRef = fromHash(hash);
	const currentRef = fromHash(currentDoc);

	if (!isSameDoc(docRef, currentRef)) {
		await render(docRef);
	}

	scrollTo(hash);

	// Keep track of the current doc
	currentDoc = toHash({
		type: docRef.type,
		repo: docRef.repo,
		version: docRef.version,
		path: docRef.path
	});

	// Highlight the currently active doc in the doc selector
	const links = docSelector.querySelectorAll('.uk-active');
	for (const link of links) {
		link.classList.remove('uk-active');
	}
	const docLink = docSelector.querySelector(`[href="${currentDoc}"]`);
	if (docLink) {
		docLink.parentElement.classList.add('uk-active');
	}

	if (docRef.path) {
		// If this is a subpage, hilight the active parent doc in the doc
		// selector
		const baseDoc = toHash({
			type: docRef.type,
			repo: docRef.repo,
			version: docRef.version
		});
		const baseDocLink = docSelector.querySelector(`[href="${baseDoc}"]`);
		if (baseDocLink) {
			baseDocLink.parentElement.classList.add('uk-active');
		}
	}
}

/**
 * Handle when a user clicks a heading
 */
function handleHeadingClick(event: Event) {
	const target = <HTMLElement>event.target;
	if (/^H/.test(target.tagName) && target.id) {
		setHash(fromHash(target.id));
	}
}

/**
 * Handle when a user clicks a link in the doc selector
 */
function handleDocSelectorClick(event: Event) {
	const target = <HTMLAnchorElement>event.target;

	if (target.tagName === 'A') {
		// Consume nav link events. Rather than relying on link clicks setting
		// the hash and then responding to hash change events, manually scroll
		// or navigate directly. Relying on hashchange events can be very slow
		// in some environments (IE11).
		event.preventDefault();

		const linkRef = target.getAttribute('href');
		if (linkRef === currentDoc) {
			scrollTo(currentDoc);
		} else {
			setHash(fromHash(linkRef));
		}

		if (mobileMedia.matches) {
			global.UIkit.offcanvas(sidebar).hide();
		}
	}

	if (target.hasAttribute('data-doc-type')) {
		const value = <DocType>target.getAttribute('data-doc-type');
		setDocType(value);
	}
}

/**
 * Handle a switch to a desktop view
 */
function handleDesktop() {
	sidebar.removeAttribute('uk-offcanvas');
	sidebar.classList.remove('uk-offcanvas');
	sidebar.firstElementChild.classList.remove('uk-offcanvas-bar');
}

/**
 * Handle a switch to a mobile view
 */
function handleMobile() {
	sidebar.setAttribute('uk-offcanvas', '');
	sidebar.firstElementChild.classList.add('uk-offcanvas-bar');
}

/**
 * Handle a UIkit scroll event
 */
function handleScrolled(event: Event) {
	const target = <HTMLElement>event.target;
	const hash = target.hasAttribute('href')
		? target.getAttribute('href')
		: '#' + target.id;
	if (hash !== location.hash) {
		// Push the state at the end of a scroll rather than setting
		// location.hash to avoid triggering any browser scrolling
		history.pushState({}, '', hash);
	}
}

/**
 * Set the active doc type
 */
async function setDocType(type: DocType) {
	document.body.setAttribute('data-doc-type', type);
	const ref = fromHash(location.hash);

	if (ref && ref.type !== type) {
		setHash({
			type,
			repo: ref.repo,
			version: ref.version
		});
	}
}

/**
 * Set the current location hash and handle the change.
 */
export function setHash(ref: LocationRef) {
	let hash = toHash(ref);

	// Update the hash value and handle it directly rather than waiting for a
	// hashchange event. In at least IE11, there can be a significant lag
	// between when the hash changes and when an event is emitted.
	history.pushState({}, '', hash);
	handleHashChange(hash);
}

/**
 * Render a doc ref
 */
async function render(ref: LocationRef) {
	try {
		const docset = await getDocSet(ref);

		if (ref.type === 'doc') {
			await renderDoc(ref, {
				docset,
				docs: docs,
				docContainer,
				tocContainer,
				docSelector
			});
		} else {
			await renderApi(ref, {
				docset,
				docs: docs,
				docContainer,
				tocContainer,
				docSelector
			});
		}
	} catch (error) {
		console.error(error);
	}
}

/**
 * Get a given docest, loading it if necessary
 */
async function getDocSet(ref: LocationRef): Promise<DocSet> {
	const hash = toHash({
		type: 'doc',
		repo: ref.repo,
		version: ref.version
	});
	let docset = docsetCache[hash];

	// Load and cache the docset metadata if it hasn't been loaded yet
	if (!docset) {
		const readme = await docFetch(ref.repo + '/' + ref.version + '/README.md');
		docset = getDocSetData(readme);
		docsetCache[hash] = docset;

		// If the docset has API docs, add the API selector to the doc selector
		if (docset.api) {
			const apiHash = toHash({
				type: 'api',
				repo: ref.repo,
				version: ref.version
			});

			const docLink = docSelector.querySelector(`[href="${hash}"]`);
			const listItem = docLink.parentElement;
			listItem.appendChild(
				h('a', { href: apiHash, 'data-doc-type': 'api' }, '[api]')
			);
		}
	}

	return docset;
}

/**
 * Get docset data from a README
 */
function getDocSetData(text: string): DocSet {
	const matcher = /^<!--\s+doc-viewer-config\s/m;
	const result = matcher.exec(text);

	if (result) {
		const index = result.index;
		const start = text.indexOf('{', index);
		const end = text.indexOf('-->', index);
		const data = text.slice(start, end).trim();
		return <DocSet>{
			readme: text,
			pages: [],
			...JSON.parse(data)
		};
	} else {
		return <DocSet>{
			readme: text,
			pages: []
		};
	}
}
