import * as MarkdownIt from 'markdown-it';
import * as hljs from 'highlight.js';
import * as h from 'hyperscript';

import {
	PageId,
	DocSetId,
	DocType,
	getDocSet,
	getCurrentDocSetId,
	getProjectUrl
} from './docs';
import { createHash } from './hash';

hljs.registerLanguage(
	'html',
	require('highlight.js/lib/languages/xml')
);
hljs.registerLanguage(
	'nginx',
	require('highlight.js/lib/languages/nginx')
);
hljs.registerLanguage(
	'javascript',
	require('highlight.js/lib/languages/javascript')
);
hljs.registerLanguage(
	'typescript',
	require('highlight.js/lib/languages/typescript')
);

export interface Slugifier {
	(url: string): string;
}

/**
 * Create a link to a page's source on GitHub
 */
export function createGitHubLink(id: DocSetId, page: string) {
	const docSet = getDocSet(id);
	const url = getProjectUrl(id.project);
	return h('a.source-link', {
		title: 'View page source',
		href: `${url}/blob/${docSet.branch}/${page}`
	});
}

/**
 * Create a link item for a menu
 */
export function createLinkItem(content: Element | string, id: PageId) {
	let text: string;
	let classes: string[] = [];
	if (typeof content === 'string') {
		text = content;
	} else {
		text = content.textContent!;
		for (let i = 0; i < content.classList.length; i++) {
			classes.push(content.classList[i]);
		}
	}
	return h(
		'li',
		{},
		h(
			'a',
			{
				href: createHash(id),
				title: text,
				className: classes.join(' ')
			},
			h('span', {}, text)
		)
	);
}

/**
 * Setup an HTML heading to support icons
 */
export function addHeadingIcons(heading: Element) {
	const existing = heading.querySelector('.heading-icons');
	if (existing != null) {
		return existing.childNodes[1];
	}

	const container = h('span.heading-icons', {}, [h('span'), h('span')]);
	const icons = container.childNodes[1];

	const content = heading.textContent!;
	heading.textContent = '';
	heading.appendChild(document.createTextNode(content));
	heading.appendChild(container);
	heading.classList.add('has-heading-icons');

	return icons;
}

/**
 * Create a function to generate URL slugs for a page.
 */
export function createSlugifier() {
	const cache: { [slug: string]: boolean } = Object.create(null);
	return (str: string) => {
		let slug = str
			.toLowerCase()
			.replace(/[^A-Za-z0-9_ ]/g, '')
			.replace(/\s+/g, '-');
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
 * Render markdown into HTML. Lazily initialize the markdown renderer.
 */
export function renderMarkdown(text: string, context: Partial<RenderContext>) {
	if (!markdown) {
		markdown = new MarkdownIt({
			// Customize the syntax highlighting process
			highlight: (str: string, lang: string) => {
				if (lang && hljs.getLanguage(lang)) {
					try {
						return (
							'<pre><code class="hljs language-' +
							lang +
							'">' +
							hljs.highlight(lang, str, true).value +
							'</code></pre>'
						);
					} catch (error) {
						console.error(error);
					}
				}

				return '<pre><code class="hljs">' + str + '</code></pre>';
			},

			// allow HTML in markdown to pass through
			html: true
		});

		// Add 'table' class to tables
		markdown.renderer.rules.table_open = () => {
			return '<table class="table is-bordered">';
		};

		markdown.renderer.rules.thead_open = (tokens: any[], idx: number) => {
			let i = idx + 2;
			let token = tokens[i];
			let empty = true;
			while (token && token.type !== 'tr_close') {
				let token2 = tokens[i + 2];
				if (
					token.type !== 'th_open' ||
					!token2 ||
					token2.type !== 'th_close'
				) {
					empty = false;
					break;
				}
				let token1 = tokens[i + 1];
				if (token1.type !== 'inline' || token1.children.length > 0) {
					empty = false;
					break;
				}
				i += 3;
				token = tokens[i];
			}
			return `<thead${empty ? ' class="is-hidden"' : ''}>`;
		};

		// Style blockquotes that are used for warning or info asides
		markdown.renderer.rules.blockquote_open = (
			tokens: any[],
			idx: number
		) => {
			// Get the token representing the first chunk of the block
			// quote
			const token = tokens[idx + 2].children[0];

			const warning = '⚠️';
			const info = '💡';
			const deprecated = '👎';

			if (token.content.indexOf(warning) === 0) {
				token.content = token.content
					.replace(warning, '')
					.replace(/^\s*/, '');
				return (
					'<blockquote class="warning"><div>' +
					'<span class="fa fa-warning" aria-hidden="true">' +
					'</span></div>'
				);
			} else if (token.content.indexOf(info) === 0) {
				token.content = token.content
					.replace(info, '')
					.replace(/^\s*/, '');
				return (
					'<blockquote class="info"><div>' +
					'<span class="fa fa-lightbulb-o" aria-hidden="true">' +
					'</span></div>'
				);
			} else if (token.content.indexOf(deprecated) === 0) {
				token.content = token.content
					.replace(deprecated, '')
					.replace(/^\s*/, '');
				return (
					'<blockquote class="deprecated"><div>' +
					'<span class="fa fa-thumbs-o-down" aria-hidden="true">' +
					'</span></div>'
				);
			}

			return '<blockquote>';
		};

		// Update relative links to markdown files
		const defaultLinkRender =
			markdown.renderer.rules.link_open ||
			((
				tokens: any[],
				idx: number,
				options: any,
				_env: RenderContext,
				self: any
			) => {
				return self.renderToken(tokens, idx, options);
			});
		markdown.renderer.rules.link_open = (
			tokens: any[],
			idx: number,
			options: any,
			env: RenderContext,
			self: any
		) => {
			const hrefIdx = tokens[idx].attrIndex('href');
			const hrefToken = tokens[idx].attrs[hrefIdx];
			const [file, hash] = hrefToken[1].split('#');
			const docSetId = getCurrentDocSetId();
			const { page, type } = env.info;

			if (!file) {
				// This is an in-page anchor link
				hrefToken[1] = createHash({
					page,
					type,
					section: hash,
					...docSetId
				});
			} else if (!/\/\//.test(file)) {
				// Ignore api: links; these will be fixed up by the API
				// renderer later
				if (type !== 'api' || file.indexOf('api:') !== 0) {
					if (/\.md$/.test(file)) {
						// This is a link to a markdown file -- make a
						// page-relative link
						const cleanFile = file.replace(/^\.\//, '');
						let pageBase = '';
						if (page.indexOf('/') !== -1) {
							pageBase = page.slice(0, page.lastIndexOf('/') + 1);
						}

						hrefToken[1] = createHash({
							page: pageBase + cleanFile,
							section: hash,
							type,
							...docSetId
						});
					} else {
						// This is a link to some other local resource -- make a
						// repo link
						hrefToken[1] = createGitHubLink(docSetId, file);
					}
				}
			}

			return defaultLinkRender(tokens, idx, options, env, self);
		};

		// Generating heading IDs for in-page links
		markdown.renderer.rules.heading_open = (
			tokens: any[],
			idx: number,
			_options: any,
			env: RenderContext
		) => {
			const token = tokens[idx];
			const content = tokens[idx + 1].content;
			const id = env.slugify(content);
			return `<${token.tag} id="${id}">`;
		};
	}

	if (!context.slugify) {
		context.slugify = context.slugify || createSlugifier();
	}

	return markdown.render(text, context);
}

/**
 * Create the sidebar menu for a docset
 */
export function renderMenu(id: DocSetId, type: DocType, maxDepth = 3) {
	const docSet = getDocSet(id);
	const pageNames = type === 'api' ? docSet.apiPages! : docSet.pages;
	const cache = type === 'api' ? docSet.apiCache! : docSet.pageCache!;
	const menu = h('ul.menu-list', { menuDepth: maxDepth });

	for (let pageName of pageNames) {
		const page = cache[pageName];
		let root: MenuNode;
		try {
			root = createNode(page.element.querySelector('h1')!);
		} catch (error) {
			root = {
				level: 1,
				element: h('li'),
				children: []
			};
		}

		const headingTags = [];
		for (let i = 2; i <= maxDepth; i++) {
			headingTags.push(`h${i}`);
		}

		const headings = page.element.querySelectorAll(headingTags.join(','))!;
		const stack: MenuNode[][] = <MenuNode[][]>[[root]];
		let children: MenuNode[];

		for (let i = 0; i < headings.length; i++) {
			let heading = headings[i];
			let newNode = createNode(heading);
			let level = newNode.level;

			if (level === stack[0][0].level) {
				stack[0].unshift(newNode);
			} else if (level > stack[0][0].level) {
				stack.unshift([newNode]);
			} else {
				while (stack[0][0].level > level) {
					children = stack.shift()!.reverse();
					stack[0][0].children = children;
				}
				if (level === stack[0][0].level) {
					stack[0].unshift(newNode);
				} else {
					stack.unshift([newNode]);
				}
			}
		}

		while (stack.length > 1) {
			children = stack.shift()!.reverse();
			stack[0][0].children = children;
		}

		const { project, version } = id;
		const pageId = { project, version, page: pageName, type };
		const li = createLinkItem(page.title, pageId);

		if (root.children.length > 0) {
			li.appendChild(renderSubMenu(root.children, pageId));
		}

		menu.appendChild(li);
	}

	return menu;
}

/**
 * Render a doc page
 */
export function renderDocPage(text: string, pageName: string, id: DocSetId) {
	text = filterGhContent(text);
	const html = renderMarkdown(text, {
		info: { page: pageName, type: DocType.docs }
	});
	const element = h('div', { innerHTML: html });

	const h1 = element.querySelector('h1')!;
	const icons = addHeadingIcons(h1);
	const link = createGitHubLink(id, pageName);
	link.classList.add('edit-page');
	icons.appendChild(link);
	element.insertBefore(h1, element.firstChild);

	return element;
}

/**
 * Create a nested submenu
 */
function renderSubMenu(children: MenuNode[], pageId: PageId) {
	const ul = h('ul');

	for (let child of children) {
		const heading = child.element;
		const li = createLinkItem(heading, {
			...pageId,
			section: heading.id
		});
		if (child.children.length > 0) {
			li.appendChild(renderSubMenu(child.children, pageId));
		}
		ul.appendChild(li);
	}

	return ul;
}

/**
 * Create a menu node
 */
function createNode(heading: Element) {
	const level = parseInt(heading.tagName.slice(1), 10);
	return { level, element: heading, children: <MenuNode[]>[] };
}

/**
 * Remove content that may be in the raw GH pages documents but shouldn't be
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

let markdown: MarkdownIt.MarkdownIt;

interface MenuNode {
	level: number;
	element: Element;
	children: MenuNode[];
}

interface RenderContext {
	info: { page: string; type: DocType };
	slugify: Slugifier;
}
