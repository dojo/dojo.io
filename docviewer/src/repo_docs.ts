import {
	fromHash,
	global,
	isSameDoc,
	scrollTo,
	toHash,
	DocType,
	LocationRef
} from './common';
import renderDoc from './render_doc';
import renderApi from './render_api';

// The list of hash addresses of available top-level docs
const docs: { doc: string[]; api: string[] } = {
	doc: [],
	api: []
};

// The hash address of the currently visible doc
let currentDoc: string;

// Get the doc container based on the location of this script in the DOM
const docContainer = document.currentScript.parentElement;
const tocContainer = document.querySelector('.docs .sidebar-right');
const docSelector = document.querySelector('.sidebar-left .uk-nav');
const mobileSidebar = document.querySelector('#mobile-sidebar');
const mobileDocSelector = mobileSidebar.querySelector('.uk-nav');
const mobileMedia = window.matchMedia('(max-width: 960px)');

Promise.all([
	inject(
		'//cdnjs.cloudflare.com/ajax/libs/markdown-it/8.4.1/markdown-it.min.js'
	),
	inject('/js/highlight.pack.js')
]).then(init);

/**
 * Initialize the doc viewer
 */
async function init() {
	// Keep a list of the available top-level docs
	docSelector.querySelectorAll('a').forEach(link => {
		if (link.getAttribute('data-doc-type') === 'doc') {
			docs.doc.push(link.getAttribute('href'));
		} else if (link.getAttribute('data-doc-type') === 'api') {
			docs.api.push(link.getAttribute('href'));
		}
	});

	// Handle left nav link clicks
	docSelector.addEventListener('click', handleLeftNavClick);
	mobileDocSelector.addEventListener('click', handleLeftNavClick);

	window.addEventListener('hashchange', event => {
		event.preventDefault();
		handleHashChange(location.hash);
	});

	// Handle in-page heading clicks
	docContainer.addEventListener('click', handleHeadingClick);

	// UIkit will emit a 'scrolled' event when an anchor has been scrolled
	// to using UIkit's scrolling functionality
	document.body.addEventListener('scrolled', handleScrolled);

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
 * Return the doc selector for the active doc type
 */
function getDocSelector() {
	if (mobileMedia.matches) {
		return mobileDocSelector;
	} else {
		return docSelector;
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

	// Highlight the currently active doc in the doc selector
	const docSel = getDocSelector();
	const activeLink = docSel.querySelector('.uk-active');
	if (activeLink) {
		activeLink.classList.remove('uk-active');
	}
	docSel
		.querySelector(`[href="${currentDoc}"]`)
		.parentElement.classList.add('uk-active');

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

		if (mobileDocSelector.contains(target)) {
			global.UIkit.offcanvas(mobileSidebar).hide();
		}
	} else if (target.hasAttribute('data-doc-type')) {
		const value = <DocType>target.getAttribute('data-doc-type');
		setDocType(value);

		if (mobileDocSelector.contains(target)) {
			global.UIkit.offcanvas(mobileSidebar).hide();
		}
	}
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
		history.pushState({}, '', hash);
	}
}

/**
 * Dynamically inject a script into the page
 */
function inject(scriptUrl: string) {
	return new Promise(resolve => {
		const script = document.createElement('script');
		script.onload = resolve;
		script.src = scriptUrl;
		document.head.appendChild(script);
	});
}

/**
 * Set the active doc type
 */
async function setDocType(type: DocType) {
	document.body.setAttribute('data-doc-type', type);
	const ref = fromHash(location.hash);

	if (ref && ref.type !== type) {
		const newRef = {
			type,
			repo: ref.repo,
			version: ref.version
		};

		const tdocs = docs[type];
		if (tdocs.indexOf(toHash(newRef)) === -1) {
			setHash(fromHash(tdocs[0]));
		} else {
			setHash(newRef);
		}
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
		if (ref.type === 'doc') {
			await renderDoc(ref, {
				docs: docs.doc,
				docContainer,
				tocContainer,
				docSelector: getDocSelector()
			});
		} else {
			await renderApi(ref, {
				docs: docs.api,
				docContainer,
				tocContainer,
				docSelector: getDocSelector()
			});
		}
	} catch (error) {
		console.error(error);
	}
}
