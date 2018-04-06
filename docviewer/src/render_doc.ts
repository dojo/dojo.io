import * as h from 'hyperscript';
import {
	docFetch,
	global,
	makeToc,
	renderMarkdown,
	toHash,
	LocationRef,
	RenderContext
} from './common';

/**
 * Render a Markdown document for a particular repo and version.
 *
 * A doc ID has the format '<org>/<repo>/<version>[/<path>]'. It looks like
 * 'dojo/cli/master' or 'dojo/core/master/docs/math.md'.
 */
export default function renderDoc(ref: LocationRef, context: RenderContext) {
	const { repo, version, path, type } = ref;
	const { docs, docContainer, tocContainer } = context;
	const file = path || 'README.md';

	return docFetch(repo + '/' + version + '/' + file).then(function(text) {
		const content = renderMarkdown(text, { ref, docs });
		docContainer.innerHTML = content;

		// Pull out any existing TOC and create a new one.
		tocContainer.innerHTML = '';
		extractToc(docContainer);
		const toc = makeToc(docContainer);
		tocContainer.appendChild(toc);

		// Clear out any nav submenu that may have been added by the API
		// renderer
		const submenu = context.docSelector.querySelector('ul');
		if (submenu) {
			submenu.parentElement.removeChild(submenu);
		}

		if (global.UIkit) {
			// Let UIkit know about the TOC since it was adding after
			// the page was created.
			global.UIkit.scrollspyNav(toc);
		}

		if (path && path !== 'README.md') {
			// If we're not viewing the base README, add a link back to
			// the parent package to the top of the doc, just for
			// context.
			const parentLink = h(
				'a',
				{ href: toHash({ type, repo, version }) },
				repo
			);
			const breadcrumbs = h('div', {}, parentLink);
			docContainer.insertBefore(breadcrumbs, docContainer.firstChild);
		}
	});
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
