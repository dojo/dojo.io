import * as MarkdownIt from 'markdown-it';

// Load the base highlightjs lib and then just the necessary languages to cut
// down on build size.
const hljs = require('highlight.js/lib/highlight');
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
hljs.registerLanguage(
	'javascript',
	require('highlight.js/lib/languages/javascript')
);
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
hljs.registerLanguage('shell', require('highlight.js/lib/languages/shell'));
hljs.registerLanguage(
	'typescript',
	require('highlight.js/lib/languages/typescript')
);
hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));

// Make a global that doesn't need 'any'
export const global = <any>window;

// TOC entries will be created for H2 - H<maxTocLevel> tags (inclusive)
export const maxTocLevel = 4;

// Used to separate the document ID from an in-page anchor ID
export const sep = '--';

export interface DocSet {
	readme: string;
	api: string;
	pages: string[];
}

export interface RenderContext {
	docs: { [pkg: string]: string };
	docset: DocSet;
	docContainer: Element;
	tocContainer: Element;
	docSelector: Element;
}

export interface MarkdownContext {
	ref: LocationRef;
	docs: { [pkg: string]: string };
}

export type DocType = 'doc' | 'api';

export interface LocationRef {
	type: DocType;
	repo: string;
	version: string;
	path?: string;
	anchor?: string;
}

/**
 * Remove all children from an element without destroying them.
 *
 * At least IE will destroy child nodes if an element is cleared by clearing
 * innerHTML.
 */
export function clearNode(elem: Element) {
	let child = elem.firstElementChild;
	while (child) {
		elem.removeChild(child);
		child = elem.firstElementChild;
	}
	// clear any remaining text or comment nodes
	elem.innerHTML = '';
}

/**
 * Create a function to generate URL slugs for a page.
 */
export function createSlugifier() {
	const cache: { [slug: string]: boolean } = Object.create(null);
	return (str: string) => {
		let slug = slugify(str);
		if (cache[slug]) {
			let i = 1;
			let next = `${slug}-${i}`;
			while (cache[next]) {
				i++;
				next = `${slug}-${i}`;
			}
			slug = next;
		}
		cache[slug] = true;
		return slug;
	};
}

/**
 * Fetch a doc. The document text will be cached in session storage.
 */
export async function docFetch(path: string) {
	const cacheKey = 'repo-doc-cache/' + path;
	const cached = sessionStorage.getItem(cacheKey);
	if (cached) {
		return Promise.resolve(cached);
	}

	const srcs = sources.slice();
	let result = await doFetch(srcs.shift() + path);
	while (result.error && srcs.length > 0) {
		result = await doFetch(srcs.shift() + path);
	}

	if (result.text != null) {
		try {
			sessionStorage.setItem(cacheKey, result.text);
		} catch (error) {
			// ignore storage errors for now
		}
		return result.text;
	} else {
		throw new Error(result.error);
	}
}

/**
 * Convert a doc ID (org/project/version) to a DOM-compatible ID
 * (org__project__version). This is necessary because UIkit uses the IDs as
 * CSS selectors for menus and scrolling, and '/' isn't valid in CSS
 * selectors.
 */
export function docIdToDomId(docId: string) {
	let id = docId.replace(/\//g, '__');
	id = id.replace(/(\w)\.(\w+)/, '$1_$2');
	return id;
}

/**
 * Convert a DOC ID (org__project__version) to a doc ID
 * (org/project/version)
 */
export function domIdToDocId(domId: string) {
	let id = domId.replace(/__/g, '/');
	id = id.replace(/(\w)_(\w)/, '$1.$2');
	return id;
}

/**
 * Return the current location has as a doc location reference
 * (type--org/project/version--anchor)
 */
export function fromHash(hash: string): LocationRef {
	if (!hash) {
		return;
	}

	if (hash[0] === '#') {
		hash = hash.slice(1);
	}

	const id = domIdToDocId(hash);
	const idParts = id.split(sep);
	const type = idParts[0];

	const docIdParts = idParts[1].split('/');
	const repo = `${docIdParts[0]}/${docIdParts[1]}`;
	const version = docIdParts[2];
	const path = docIdParts.slice(3).join('/');

	// The anchor itself may have contained sep, so rejoin anything after the
	// docId.
	const anchor = idParts.slice(2).join(sep);

	return <LocationRef>{ type, repo, version, path, anchor };
}

/**
 * Return a doc ID corresponding to a location or href string. For example,
 * the doc ID corresponding to
 *
 * 	 http://localhost:8888/docs/index.html#dojo__routing__master--router
 *
 * would be 'dojo/routing/master'.
 */
export function getDocId(locationOrHref: string | Location) {
	let hash: string;

	if (typeof locationOrHref === 'string') {
		// locationOrHref is the href from an anchor tag, so it will be a
		// hash ref (like #dojo/cli/master)
		hash = locationOrHref.slice(locationOrHref.indexOf('#') + 1);
	} else {
		// locationOrHref is a browser Location object
		hash = locationOrHref.hash.slice(1);
	}

	// If the link references an in-page anchor, it will contain a `sep`
	// character.
	const id = hash.split(sep)[0];

	// The hash will be a DOM-combatible ID
	return domIdToDocId(id);
}

/**
 * Highlight code using hilight.js
 */
export function highlight(lang: string, code: string) {
	return hljs.highlight(lang, code, true).value;
}

/**
 * Create a markdown renderer
 */
export function initMarkdownRenderer() {
	const markdown = MarkdownIt({
		// Customize the syntax highlighting process
		highlight: function(str: string, lang: string) {
			if (lang && hljs.getLanguage(lang)) {
				try {
					return (
						'<pre class="hljs language-' +
						lang +
						'">' +
						hljs.highlight(lang, str, true).value +
						'</pre>'
					);
				} catch (error) {
					console.error(error);
				}
			}

			return '<pre class="hljs language-' + lang + '">' + str + '</pre>';
		},

		// allow HTML in markdown to pass through
		html: true
	});

	const rules = markdown.renderer.rules;

	// Keep a reference to the default link renderer to fallback to
	const defaultLinkRender =
		rules.link_open ||
		function(
			tokens: any[],
			idx: number,
			options: any,
			_env: MarkdownContext,
			self: any
		) {
			return self.renderToken(tokens, idx, options);
		};

	// Make relative links (particularly TOC links) work properly
	rules.link_open = function(
		tokens: any[],
		idx: number,
		options: any,
		env: MarkdownContext,
		self: any
	) {
		const hrefIdx = tokens[idx].attrIndex('href');
		const hrefToken = tokens[idx].attrs[hrefIdx];
		const hrefParts = hrefToken[1].split('#');
		const file = hrefParts[0];
		const hash = hrefParts[1];
		const { ref } = env;
		const domId = docIdToDomId(`${ref.repo}/${ref.version}`);

		if (!file) {
			// This is an in-page anchor link
			hrefToken[1] = '#' + domId + sep + hash;
		} else if (/github.com/.test(file)) {
			// This is a github link -- see if it's relative to our docs
			const match = /https?:\/\/github.com\/([^/]+)\/([^/]+)/.exec(file);
			if (match) {
				const pkg = match[1] + '/' + match[2];
				const { docs } = env;
				const pkgs = Object.keys(docs);
				if (pkgs.indexOf(pkg) !== -1) {
					const docHash = docs[pkg];
					hrefToken[1] = `${docIdToDomId(docHash)}`;
					if (hash) {
						hrefToken[1] += `${sep}${hash}`;
					}
				}
			}
		} else if (!/^https?:/.test(file)) {
			// This is a relative link
			hrefToken[1] = docIdToDomId(`#doc${sep}${domId}/${file}`);
		}

		return defaultLinkRender(tokens, idx, options, env, self);
	};

	// Generate heading IDs for TOC links
	rules.heading_open = function(
		tokens: any[],
		idx: number,
		_options: any,
		env: MarkdownContext
	) {
		const token = tokens[idx];
		const level = Number(token.tag.slice(1));
		const content = tokens[idx + 1].content;
		const { ref } = env;

		let docId = `${ref.repo}/${ref.version}`;
		if (ref.path) {
			docId += `/${ref.path}`;
		}

		// The page title is given the ID of the page itself. This allows
		// the H1 to be targetted by UIkit's scrolling code to smooth scroll
		// to the top of the page when necessary. Everything lower is given
		// a heading-specific ID.
		let anchorId = `${ref.type}${sep}${docIdToDomId(docId)}`;
		if (level > 1) {
			anchorId += sep + slugify(content);
		}

		// Links that show up on the TOC get a link icon that shows up when
		// the heading is hovered over.
		let icon = '';
		if (level > 1 && level <= maxTocLevel) {
			icon = '<span uk-icon="icon: link"></span>';
		}
		return '<' + token.tag + ' id="' + anchorId + '">' + icon;
	};

	return markdown;
}

/**
 * Create a Table of Contents for a doc
 */
export function makeToc(container: Element) {
	const tags = ['h2'];
	for (let i = 3; i <= maxTocLevel; i++) {
		tags.push('h' + i);
	}
	const headings = container.querySelectorAll(tags.join(','));

	const toc = document.createElement('ul');

	// Add UIkit classes and attributes for nav styles and scroll spy
	// functionality
	toc.classList.add('uk-nav');
	toc.classList.add('uk-nav-default');
	toc.setAttribute(
		'uk-scrollspy-nav',
		'closest: li; scroll: true; offset: 100'
	);

	let lastItem: Element;
	let level = 0;

	for (const heading of headings) {
		const link = document.createElement('a');
		link.href = '#' + heading.id;
		link.textContent = heading.textContent;

		const item = document.createElement('li');
		item.appendChild(link);

		// Get the level of the current heading
		const headingLevel = Number(heading.tagName.slice(1)) - 2;

		if (!lastItem) {
			// This is the first thing in the TOC
			toc.appendChild(item);
		} else if (headingLevel === level) {
			// This is at the same level as the last item in the TOC
			lastItem.parentElement.appendChild(item);
		} else if (headingLevel > level) {
			// This is under the last item in the TOC
			const submenu = document.createElement('ul');
			submenu.classList.add('uk-nav-sub');
			submenu.classList.add('uk-nav-default');
			submenu.appendChild(item);
			lastItem.appendChild(submenu);
		} else {
			// This is above the last item in the TOC
			let parent = lastItem.parentElement;
			let hlvl = level;
			while (parent && hlvl > headingLevel) {
				parent = parent.parentElement.parentElement;
				hlvl--;
			}
			(parent || toc).appendChild(item);
		}

		lastItem = item;
		level = headingLevel;
	}

	return toc;
}

/**
 * Render a markdown doc and return the resulting HTML
 */
export function renderMarkdown(
	md: string,
	context: { ref: LocationRef; docs: { [pkg: string]: string } }
) {
	if (!markdown) {
		markdown = initMarkdownRenderer();
	}
	const filtered = filterGhContent(md);
	return markdown.render(filtered, context);
}

/**
 * Indicate whether two refs refer to the same doc
 */
export function isSameDoc(a: LocationRef, b: LocationRef) {
	if ((a && !b) || (b && !a)) {
		return false;
	}
	if (a.type !== b.type || a.repo !== b.repo || a.version !== b.version) {
		return false;
	}
	if (a.path || (b.path && a.path !== b.path)) {
		return false;
	}
	return true;
}

/**
 * Reset the scroll position of an element
 */
export function resetScroll(elem: Element) {
	let parent = elem.parentElement;
	while (parent && parent.scrollTop === 0) {
		parent = parent.parentElement;
	}
	if (parent && parent.scrollTop !== 0) {
		parent.scrollTop = 0;
	}
}

/**
 * Scroll to a given anchor
 */
export function scrollTo(target: string | Element, offset = 100) {
	if (typeof target === 'string') {
		if (target[0] !== '#') {
			target = `#${target}`;
		}
		target = docIdToDomId(target);
		target = document.querySelector(target);
	}

	if (target) {
		// If the target is the main page heading, scroll a little extra
		if (target.tagName === 'H1') {
			offset = 150;
		}

		global.UIkit.scroll(target, { offset }).scrollTo(target);
	}
}

/**
 * Convert a location ref to a URL hash
 */
export function toHash(ref: LocationRef) {
	const { type, repo, version, path, anchor } = ref;
	let hash = `#${type}${sep}${docIdToDomId(repo)}__${version}`;
	if (path) {
		hash += `__${docIdToDomId(path)}`;
	}
	if (anchor) {
		hash += `${sep}${anchor}`;
	}
	return hash;
}

/**
 * Generate a standardized slug from a string. This attempts to follow
 * GitHub's format so that it will match up with ref links in GitHub docs.
 */
export function slugify(str: string) {
	return str
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^A-Za-z0-9_\- ]/g, '');
}

// These are sources for github content. The CDNs will likely be faster than
// raw.githubusercontent, and are not (as) rate limited.
const sources = [
	'https://gitcdn.xyz/repo/',
	'https://rawcdn.githack.com/',
	'https://cdn.rawgit.com/',
	'https://raw.githubusercontent.com/'
];

// The markdown renderer
let markdown: markdownit.MarkdownIt;

/**
 * Fetch a file, trying multiple source domains
 */
async function doFetch(
	path: string
): Promise<{ error?: string; text?: string }> {
	try {
		const response = await fetch(path);
		if (response.status !== 200) {
			return { error: `Request to ${path} failed: ${response.statusText}` };
		}

		const text = await response.text();
		if (text.trim() === '404: Not Found') {
			return { error: `Request to ${path} failed: ${text.trim()}` };
		}
		return { text };
	} catch (error) {
		return { error: error.message };
	}
}

/**
 * Filter content from a markdown doc that shouldn't be rendered
 */
function filterGhContent(text: string) {
	// This would be simpler with regular expressions, but that makes IE10
	// sad.
	const markers = [
		['<!-- vim-markdown-toc GFM -->', '<!-- vim-markdown-toc -->'],
		['<!-- start-github-only -->', '<!-- end-github-only -->']
	];
	return markers.reduce((text, marker) => {
		const chunks = [];
		let start = 0;
		let left = text.indexOf(marker[0]);
		let right = 0;
		while (left !== -1) {
			chunks.push(text.slice(start, left));
			right = text.indexOf(marker[1], left);
			if (right === -1) {
				break;
			}
			start = right + marker[1].length;
			left = text.indexOf(marker[0], start);
		}
		if (right !== -1) {
			chunks.push(text.slice(start));
		}
		return chunks.join('');
	}, text);
}
