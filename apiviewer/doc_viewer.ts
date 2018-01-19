/**
 * Intern doc viewer
 */

import * as PromisePolyfill from 'promise-polyfill';
import * as h from 'hyperscript';

import {
	DocSet,
	DocSetId,
	DocPage,
	DocType,
	getProjects,
	getVersions,
	getCurrentDocSetId,
	getDefaultDocSetId,
	getDocSet,
	getCurrentPageId,
	getDefaultPageId,
	getDocBaseUrl,
	getDocVersionUrl,
	getLatestVersion,
	getNextVersion,
	getProjectLogo
} from './docs';
import { renderApiPages } from './render_api';
import { renderMenu, renderDocPage } from './render';
import { createHash, parseHash, updateHash, HashEvent } from './hash';
import search from './search';

const global = <any>window;
if (!global.Promise) {
	global.Promise = <typeof Promise>(<any>PromisePolyfill);
}

let viewer: HTMLElement;
let content: HTMLElement;
let messageModal: HTMLElement;
let ignoreScroll = false;
let searchPanel: HTMLElement;
let scrollState: {
	pageHash: string;
	headings: NodeListOf<Element>;
} = Object.create(null);

const searchDelay = 300;
const menuHighlightDelay = 20;

// Super simple router. The location hash fully controls the state of the
// doc viewer. Changes to the project and version selectors will update the
// hash, which will cause new content to be rendered.
window.addEventListener('hashchange', processHash);

// If the base docs page is loaded without a hash, set a default hash to
// get a docset to load.
if (!location.hash) {
	updateHash({ ...getDefaultDocSetId(), type: DocType.docs });
	processHash();
}

// Create a promise that resolves when the doc is ready (just for
// convenience)
const ready = new Promise(resolve => {
	window.addEventListener('load', resolve);
});

ready.then(() => {
	viewer = <HTMLElement>document.body;
	content = <HTMLElement>document.querySelector('.docs-content');
	messageModal = <HTMLElement>document.querySelector('.message-modal')!;
	searchPanel = <HTMLElement>document.querySelector('.search-panel')!;

	// Handle updates to the project + version selects.
	document.querySelector('.docs-nav')!.addEventListener('change', event => {
		const target: Element = <Element>event.target;
		if (target.tagName !== 'SELECT') {
			return;
		}

		const select = <HTMLSelectElement>target;
		const docSetId = getCurrentDocSetId();

		if (target.getAttribute('data-select-property') === 'project') {
			// The project was changed
			docSetId.project = select.value;
			docSetId.version = getLatestVersion(select.value);
		} else {
			// The version was changed
			docSetId.version = select.value;
		}

		updateHash({ ...docSetId, type: DocType.docs, page: 'README.md' });
		processHash();
	});

	// Open the search dropdown if the user clicks a search button
	document.querySelector('.docs-nav')!.addEventListener('click', event => {
		let target = <HTMLElement>event.target;

		if (target.classList.contains('fa')) {
			// An icon was clicked, get its parent
			target = target.parentElement!;
		}

		if (target.classList.contains('search-button')) {
			target.classList.toggle('is-active');
			viewer.classList.toggle('is-searching');
			if (viewer.classList.contains('is-searching')) {
				searchPanel.querySelector('input')!.focus();
			}
		} else if (target.classList.contains('navbar-burger')) {
			const menuId = target.getAttribute('data-target')!;
			const menu = document.getElementById(menuId)!;
			target.classList.toggle('is-active');
			menu.classList.toggle('is-active');
		}
	});

	// Live search as the user types into the search dropdown input
	let searchTimer: number | undefined;
	searchPanel.addEventListener('input', event => {
		if (searchTimer) {
			clearTimeout(searchTimer);
		}
		searchTimer = <any>setTimeout(() => {
			const results = searchPanel.querySelector('.search-results')!;
			const docType = <DocType>viewer.getAttribute('data-doc-type')!;
			search((<HTMLInputElement>event.target).value, docType, results);
		}, searchDelay);
	});

	// Clear the search field when the user clicks the 'x' in the search box
	searchPanel.querySelector('.button')!.addEventListener('click', () => {
		const results = searchPanel.querySelector('.search-results')!;
		const docType = <DocType>viewer.getAttribute('data-doc-type')!;
		const input = <HTMLInputElement>searchPanel.querySelector('input');
		input.value = '';
		search('', docType, results);
		searchPanel.querySelector('input')!.focus();
	});

	// Update the url hash as the user scrolls
	let menuTimer: number | undefined;
	content.addEventListener('scroll', () => {
		const ignoring = ignoreScroll;
		ignoreScroll = false;
		if (ignoring) {
			return;
		}
		if (menuTimer) {
			clearTimeout(menuTimer);
		}
		menuTimer = <any>setTimeout(() => {
			menuTimer = undefined;
			updateHashFromContent();
		}, menuHighlightDelay);
	});

	processHash();
});

/**
 * Load a docset.
 *
 * An optional page and section may be provided. When the docset is
 * finished loading, the given page, or the first page in the set, will be
 * shown.
 */
function loadDocSet(id: DocSetId): Promise<DocSet> {
	const docSet = getDocSet(id);

	if (docSet.ready) {
		// The docset is already visible, so don't do anything
		return Promise.resolve(docSet);
	}

	// The message will be hidden in process hash, after the UI has been
	// updated
	showMessage('', '', 'loading');

	const docBase = getDocBaseUrl(id);
	const cache = (docSet.pageCache = <{
		[name: string]: DocPage;
	}>Object.create(null));

	return fetch(`${docBase}README.md`)
		.then(response => response.text())
		.then(readme => {
			const logo = getProjectLogo(id.project);
			renderPage(readme, 'README.md', id, logo);

			const matcher = /^<!--\s+doc-viewer-config\s/m;
			if (matcher.test(readme)) {
				const result = matcher.exec(readme)!;
				const index = result.index;
				const start = readme.indexOf('{', index);
				const end = readme.indexOf('-->', index);
				const data = readme.slice(start, end).trim();
				return <DocSet>JSON.parse(data);
			}
			return null;
		})
		.then(config => {
			if (config) {
				for (const key of Object.keys(config)) {
					const prop = <keyof DocSet>key;
					docSet[prop] = config[prop];
				}
			}

			const pageNames = (docSet.pages = ['README.md'].concat(
				docSet.pages || []
			));

			docSet.ready = Promise.all(
				pageNames.filter(name => name !== 'README.md').map(name => {
					return fetch(docBase + name)
						.then(response => response.text())
						.then(text => renderPage(text, name, id));
				})
			).then(() => {
				docSet.menu = renderMenu(id, DocType.docs);
			});

			if (docSet.api) {
				docSet.apiReady = fetch(docBase + docSet.api)
					.then(response => {
						return response.json();
					})
					.then(data => {
						renderApiPages(id, data);
						docSet.apiMenu = renderMenu(id, DocType.api, 4);
					});
			}

			return docSet;
		});

	function renderPage(
		text: string,
		name: string,
		id: DocSetId,
		logo?: string
	) {
		return ready.then(() => {
			const element = renderDocPage(text, name, id);
			const h1 = element.querySelector('h1');
			const title = (h1 && h1.textContent) || id.project;
			if (logo && h1) {
				const logoImg = h('img.logo', { src: logo });
				h1.insertBefore(logoImg, h1.firstChild);
			}
			cache[name] = { name, element, title };
		});
	}
}

/**
 * Update the links in doc navbar
 */
function updateNavBarLinks(id: DocSetId) {
	const docSet = getDocSet(id);
	const navbar = <HTMLElement>document.querySelector(
		'.docs-nav .navbar-start'
	);

	navbar.classList[docSet.api ? 'add' : 'remove']('has-api');
	navbar.classList[docSet.pages ? 'add' : 'remove']('has-docs');

	const docTypes = <DocType[]>Object.keys(DocType).filter(
		type => !Number(type)
	);
	for (const type of docTypes) {
		const link = <HTMLLinkElement>navbar.querySelector(
			`.navbar-item[data-doc-type="${type}"]`
		)!;
		link.href = createHash({
			project: id.project,
			version: id.version,
			type
		});
	}
}

/**
 * Select the currently active project in the project selector.
 */
function updateDocsetSelector() {
	const pageId = getCurrentPageId();
	const selector = document.querySelector(
		'select[data-select-property="project"]'
	)!;

	if (selector.children.length === 0) {
		for (let name of getProjects()) {
			const option = h('option', { value: name }, name);
			selector.appendChild(option);
		}
	}

	const option = <HTMLOptionElement>selector.querySelector(
		`option[value="${getCurrentPageId().project}"]`
	);
	if (option) {
		option.selected = true;
	}

	const versions = getVersions(pageId.project).reverse();
	// If more than one version is available, show the version selector
	if (versions.length > 1) {
		viewer.classList.add('multi-version');

		const selector = document.querySelector(
			'select[data-select-property="version"]'
		)!;
		selector.innerHTML = '';
		const latestVersion = getLatestVersion(pageId.project);
		const nextVersion = getNextVersion(pageId.project);
		for (const version of versions) {
			let text = `v${version}`;
			if (version === latestVersion) {
				text += ' (release)';
			} else if (version === nextVersion) {
				text += ' (dev)';
			}
			selector.appendChild(
				h(
					'option',
					{ value: version, selected: version === pageId.version },
					text
				)
			);
		}
	} else {
		viewer.classList.remove('multi-version');
	}
}

/**
 * Show a page in the currently loaded docset
 */
function showPage(type: DocType, name: string, section?: string) {
	const docSet = getDocSet(getCurrentDocSetId());
	const page = getPage(docSet, type, name);
	const content = <HTMLElement>document.body.querySelector('.docs-content')!;
	if (content.children.length > 0) {
		content.removeChild(content.children[0]);
	}
	content.appendChild(page.element);

	// Do highlighting before scrolling a sectoin into view. Highlighting
	// also involves scroll manipulation, and if the viewer is using a
	// mobile layout, we want the content scroll to take priority over the
	// menu scroll.
	highlightActivePage();
	highlightActiveSection();

	// Showing the page will probably scroll the content area, but we don't
	// want to invoke the normal scroll handling code in this case.
	ignoreScroll = true;

	if (section) {
		const header = <HTMLElement>document.querySelector(`#${section}`);
		if (header) {
			header.scrollIntoView();
		}
	} else {
		content.scrollTop = 0;
	}
}

/**
 * Get a rendered page from a doc set
 */
function getPage(docSet: DocSet, type: DocType, name?: string) {
	if (!name) {
		const pageNames =
			type === DocType.api ? docSet.apiPages! : docSet.pages;
		name = pageNames[0];
	}
	return type === DocType.api
		? docSet.apiCache![name]
		: docSet.pageCache![name];
}

/**
 * Highlight the active page in the sidebar menu
 */
function highlightActivePage() {
	const menu = document.querySelector('.docs-menu .menu .menu-list')!;
	const active = menu.querySelector('.is-active-page');
	if (active) {
		active.classList.remove('is-active-page');
	}

	const pageId = getCurrentPageId(false);
	const currentPage = createHash(pageId);

	const pageLink = menu.querySelector(`li > a[href="${currentPage}"]`)!;
	if (pageLink) {
		pageLink.parentElement!.classList.add('is-active-page');
	}
}

/**
 * Highlight the active element in the sidebar menu
 */
function highlightActiveSection() {
	const menu = document.querySelector('.docs-menu .menu-list')!;
	if (!menu) {
		return;
	}

	const active = menu.querySelector('.is-active');
	if (active) {
		active.classList.remove('is-active');
	}

	const currentSection = location.hash;
	let link = <HTMLElement>menu.querySelector(
		`li > a[href="${currentSection}"]`
	)!;
	if (!link) {
		try {
			const docs = getCurrentPageId();
			const currentPage = createHash({
				project: docs.project,
				version: docs.version,
				type: docs.type,
				page: docs.page
			});
			link = <HTMLElement>menu.querySelector(
				`li > a[href="${currentPage}"]`
			)!;
		} catch (error) {
			// ignore
		}
	}

	if (link) {
		link.classList.add('is-active');
		scrollIntoViewIfNessary(link, <HTMLElement>document.querySelector(
			'.docs-menu'
		)!);
	}
}

/**
 * Install the current docset's docs menu in the menu container
 */
function showMenu(type?: DocType) {
	type = type || DocType.docs;
	const docSet = getDocSet(getCurrentDocSetId());
	const menu = document.querySelector('.docs-menu .menu')!;
	const menuList = menu.querySelector('.menu-list');
	if (menuList) {
		menu.removeChild(menuList);
	}
	const docMenu = type === DocType.api ? docSet.apiMenu! : docSet.menu!;
	menu.appendChild(docMenu);
}

/**
 * Process the current URL hash value.
 */
function processHash() {
	highlightActiveSection();

	try {
		const docSetId = getCurrentDocSetId();
		loadDocSet(docSetId)
			.then(docSet => {
				const { type } = parseHash();
				const ready =
					type === DocType.api ? docSet.apiReady! : docSet.ready!;
				ready
					.then(() => {
						const pageId = getCurrentPageId();
						const {
							project,
							version,
							type,
							page,
							section
						} = pageId;

						viewer.setAttribute('data-doc-type', type);

						const container = document.querySelector(
							'.docs-content'
						)!;
						container.setAttribute('data-doc-project', project);
						container.setAttribute('data-doc-version', version);

						showMenu(type);
						showPage(type, page, section);
						updateGitHubButtons(pageId);
						updateNavBarLinks(pageId);
						updateDocsetSelector();
						hideMessage();
					})
					.catch(error => {
						// The current hash doesn't specify a valid page ID
						const { type, page } = parseHash();
						if (page) {
							// The URL contains a page, and it is invalid
							throw error;
						}

						// The URL doesn't contain a page
						updateHash(
							createHash(
								getDefaultPageId(docSetId, type || DocType.docs)
							),
							HashEvent.rename
						);
						processHash();
					})
					.catch(error => {
						let { type } = parseHash();
						type = type in DocType ? type : DocType.docs;
						const newHash = createHash({ ...docSetId, type });
						showError(error, newHash);
					});
			})
			.catch(error => {
				const newHash = createHash({ ...docSetId, type: DocType.docs });
				showError(error, newHash);
			});
	} catch (error) {
		// The current hash doesn't identify a valid doc set
		if (!location.hash.slice(1)) {
			// No hash was specified -- load a default
			updateHash(
				createHash({ ...getDefaultDocSetId(), type: DocType.docs }),
				HashEvent.rename
			);
			processHash();
		} else {
			const { project } = parseHash();
			if (getProjects().indexOf(project) !== -1) {
				const version = getLatestVersion(project);
				updateHash(
					createHash({ project, version, type: DocType.docs }),
					HashEvent.rename
				);
				processHash();
			} else {
				// An invalid hash was specified -- show an error
				showError(error);
			}
		}
	}

	function showError(error: Error, newHash?: string) {
		console.error(error);
		showMessage(
			'Oops...',
			h('span', {}, [
				'The URL hash ',
				h('code', {}, location.hash),
				" isn't valid. Click ",
				h('a', { href: `${newHash || '#'}` }, 'here'),
				' to open the default doc set.'
			]),
			'error'
		);
	}
}

/**
 * Show a message in the error modal
 */
function showMessage(heading: string, message: string | Element, type = '') {
	messageModal.querySelector('.message-heading')!.textContent = heading;
	const content = messageModal.querySelector('.message-content')!;
	content.innerHTML = '';
	if (typeof message === 'string') {
		content.textContent = message;
	} else {
		content.appendChild(message);
	}
	messageModal.classList.add('is-active');
	messageModal.setAttribute('data-message-type', type);
}

/**
 * Show a message in the error modal
 */
function hideMessage() {
	messageModal.classList.remove('is-active');
}

/**
 * Update the hrefs for the navbar GitHub buttons
 */
function updateGitHubButtons(docs: DocSetId) {
	const links = <NodeListOf<HTMLAnchorElement>>document.querySelectorAll(
		'.github-button'
	);
	const url = getDocVersionUrl(docs);
	for (let i = 0; i < links.length; i++) {
		links[i].href = url;
	}
}

/**
 * Scroll an element into view if it's not currently visible within its
 * container.
 */
function scrollIntoViewIfNessary(element: HTMLElement, container: HTMLElement) {
	const viewportTop = container.offsetTop + container.scrollTop;
	const viewportBottom = viewportTop + container.clientHeight;
	const elementTop = element.offsetTop;
	const elementBottom = elementTop + element.offsetHeight;
	if (elementTop < viewportTop) {
		element.scrollIntoView(true);
	} else if (elementBottom > viewportBottom) {
		element.scrollIntoView(false);
	}
}

/**
 * Update the location hash based on the currently visible doc contents.
 */
function updateHashFromContent() {
	const pageId = getCurrentPageId(false);
	const pageHash = createHash(pageId);

	if (pageHash !== scrollState.pageHash) {
		const content = <HTMLElement>document.querySelector('.docs-content')!;
		const menu = document.querySelector('.docs-menu .menu-list');
		const depth = <number>(<any>menu).menuDepth || 3;
		const tags = <string[]>[];
		for (let i = 1; i < depth; i++) {
			tags.push(`h${i + 1}`);
		}
		scrollState.pageHash = pageHash;
		scrollState.headings = content.querySelectorAll(tags.join(','))!;
	}

	const viewportTop = content.offsetTop + content.scrollTop;
	const { headings } = scrollState;

	let above: Element | undefined;
	let below: Element | undefined;
	for (let i = 1; i < headings.length; i++) {
		const heading = <HTMLElement>headings[i];
		const headingTop = getOffsetTop(heading);
		if (headingTop > viewportTop) {
			below = headings[i];
			above = headings[i - 1];
			break;
		}
	}

	if (!above) {
		above = headings[headings.length - 1];
	}

	updateHash(
		{
			project: pageId.project,
			version: pageId.version,
			type: <DocType>viewer.getAttribute('data-doc-type')!,
			page: pageId.page,
			section: above.id
		},
		HashEvent.scroll
	);

	highlightActiveSection();

	function getOffsetTop(element: HTMLElement) {
		let top = element.offsetTop;
		while (
			(element = <HTMLElement>element.offsetParent) &&
			element !== content
		) {
			top += element.offsetTop;
		}
		return top;
	}
}
