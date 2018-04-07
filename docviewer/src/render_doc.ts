import * as h from 'hyperscript';
import {
	docFetch,
	global,
	makeToc,
	renderMarkdown,
	toHash,
	DocSet,
	LocationRef,
	RenderContext
} from './common';

const renderCache: {
	[hash: string]: {
		page: Element;
		menu: Element;
		toc: Element;
	};
} = {};

/**
 * Render a Markdown document for a particular repo and version.
 *
 * A doc ID has the format '<org>/<repo>/<version>[/<path>]'. It looks like
 * 'dojo/cli/master' or 'dojo/core/master/docs/math.md'.
 */
export default async function renderDoc(
	ref: LocationRef,
	context: RenderContext
) {
	const { docs, docset, docContainer, tocContainer } = context;
	const { repo, version, path } = ref;
	const file = path || 'README.md';
	const hash = toHash(ref);
	let page: Element;
	let menu: Element;
	let toc: Element;

	if (renderCache[hash]) {
		page = renderCache[hash].page;
		menu = renderCache[hash].menu;
		toc = renderCache[hash].toc;
	} else {
		let text: string;

		if (file === 'README') {
			text = context.docset.readme;
		} else {
			text = await docFetch(repo + '/' + version + '/' + file);
		}

		const html = renderMarkdown(text, { ref, docs });
		page = h('div', { innerHTML: html });

		// Make any tables in the page use ui-kit styles
		page.querySelectorAll('table').forEach(table => {
			table.classList.add('uk-table');
		});

		toc = makeToc(page);
		menu = makeMenu(ref, docset);

		// Pull out any existing TOC from the README itself
		extractToc(page);

		renderCache[hash] = { page, toc, menu };
	}

	docContainer.innerHTML = '';
	docContainer.appendChild(page);

	tocContainer.innerHTML = '';
	tocContainer.appendChild(toc);

	if (global.UIkit) {
		// Let UIkit know about the TOC since it was adding after
		// the page was created.
		global.UIkit.scrollspyNav(toc);
	}

	// Clear out any nav submenu that may have been added by the API
	// renderer
	const existingMenu = context.docSelector.querySelector('ul');
	if (existingMenu) {
		existingMenu.parentElement.removeChild(existingMenu);
	}

	// Add this page's menu
	if (menu) {
		const baseHash = toHash({
			type: 'doc',
			repo: ref.repo,
			version: ref.version
		});
		const docLink = context.docSelector.querySelector(`[href="${baseHash}"]`);
		docLink.parentElement.appendChild(menu);
	}
}

/**
 * Make a package doc menu from a docset
 */
function makeMenu(docRef: LocationRef, docset: DocSet) {
	if (docset.pages.length === 0) {
		return null;
	}

	return h(
		'ul',
		{ className: 'uk-nav-sub uk-nav-default' },
		docset.pages.map(page => {
			const name = page.replace(/^docs\//, '').replace(/\.md$/, '');
			const hash = toHash({
				type: 'doc',
				repo: docRef.repo,
				version: docRef.version,
				path: page
			});
			return h('li', {}, h('a', { href: hash }, name));
		})
	);
}

/**
 * Locate and remove a table of contents from a README. Return the TOC
 * element.
 *
 * For this method's purposes, a "table of contents" is a list of links
 * within the first 10 nodes of a document.
 */
function extractToc(elem: Element) {
	let child: Element;

	// Look through the first few elements for a likely candidate
	for (let i = 0; i < 10; i++) {
		child = elem.children[i];
		if (child && isToc(child)) {
			child.parentNode.removeChild(child);
			return child;
		}
	}
}

/**
 * Return true if the given element appears to be a Table of Contents
 */
function isToc(elem: Element) {
	if (elem.tagName !== 'UL') {
		return false;
	}

	let child = elem.firstElementChild;
	let link;
	let sublist;
	while (child) {
		if (child.tagName !== 'LI') {
			return false;
		}
		link = child.firstElementChild;
		if (!link || link.tagName !== 'A') {
			return false;
		}
		sublist = link.nextElementSibling;
		if (sublist && sublist.tagName !== 'UL') {
			return false;
		}
		if (sublist && !isToc(sublist)) {
			return false;
		}
		child = child.nextElementSibling;
	}

	return true;
}
