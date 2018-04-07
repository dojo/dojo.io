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
const docContainer = document.currentScript.parentElement;
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
	docSelector.querySelectorAll('a').forEach(link => {
		const pkg = link.getAttribute('data-package');
		docs[pkg] = link.getAttribute('href');
	});

	// Update the UI when the viewport changes size
	mobileMedia.addListener(event => {
		if (event.matches) {
			handleMobile();
		} else {
			handleDesktop();
		}
	});

	// Handle left nav link clicks
	docSelector.addEventListener('click', handleLeftNavClick);
	// mobileDocSelector.addEventListener('click', handleLeftNavClick);

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
		// If the new hash doesn't match the current document, render
		// the new doc
		await render(docRef);
	}

	// Keep track of the current doc
	currentDoc = toHash({
		type: docRef.type,
		repo: docRef.repo,
		version: docRef.version,
		path: docRef.path
	});

	// Update the doctype

	// Highlight the currently active doc in the doc selector
	docSelector.querySelectorAll('.uk-active').forEach(link => {
		link.classList.remove('uk-active');
	});

	const docLink = docSelector.querySelector(`[href="${currentDoc}"]`);
	if (docLink) {
		docLink.parentElement.classList.add('uk-active');
	}

	const baseDoc = toHash({
		type: docRef.type,
		repo: docRef.repo,
		version: docRef.version
	});
	const baseDocLink = docSelector.querySelector(`[href="${baseDoc}"]`);
	if (baseDocLink) {
		baseDocLink.parentElement.classList.add('uk-active');
	}

	if (docContainer.querySelector(hash)) {
		scrollTo(hash);
	} else {
		const heading = docContainer.querySelector('h1');
		if (heading) {
			scrollTo(heading.getAttribute('id'));
		}
	}
}

/**
 * Handle when a user clicks a heading
 */
function handleHeadingClick(event: Event) {
	const target = <HTMLElement>event.target;
	if (/H[2-4]/.test(target.tagName) && target.id) {
		setHash(fromHash(target.id));
	}
}

/**
 * Handle when a user clicks a left nav link
 */
function handleLeftNavClick(event: Event) {
	const target = <HTMLAnchorElement>event.target;
	if (target.tagName === 'A') {
		const linkRef = target.getAttribute('href');
		if (linkRef === currentDoc) {
			// Consume a nav link event click when the target URL is for the
			// currently visible doc. This keeps the browser from making the
			// scroll position jump around.
			event.preventDefault();
			scrollTo(currentDoc);
		}

		if (mobileMedia.matches) {
			global.UIkit.offcanvas(sidebar).hide();
		}

		// if (mobileDocSelector.contains(target)) {
		// 	global.UIkit.offcanvas(mobileSidebar).hide();
		// }
	}

	if (target.hasAttribute('data-doc-type')) {
		const value = <DocType>target.getAttribute('data-doc-type');
		setDocType(value);

		// 		if (mobileDocSelector.contains(target)) {
		// 			global.UIkit.offcanvas(mobileSidebar).hide();
		// 		}
	}
}

function handleDesktop() {
	sidebar.removeAttribute('uk-offcanvas');
	sidebar.classList.remove('uk-offcanvas');
	sidebar.firstElementChild.classList.remove('uk-offcanvas-bar');
}

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
		setHash(fromHash(hash));
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
 * Set the current location hash and scroll to the corresponding anchor
 */
export function setHash(ref: LocationRef) {
	let hash = toHash(ref);

	// Push the hash ont o the history rather than setting it to prevent the
	// browser from jumping to the hash location. This means the doc viewer
	// can't entirely rely on hashchange events.
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
