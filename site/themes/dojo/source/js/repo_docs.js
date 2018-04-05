(function () {
	// Number of scripts to load; incremented by `inject`
	var toLoad = 0;
	// Number of scripts loaded; incremented by `injected`
	var loaded = 0;

	// The markdown renderer
	var markdown;

	// Used to separate the document ID from an in-page anchor ID
	var sep = '--';

	// The list of available doc IDs
	var docs = [];

	// The currently visible doc
	var currentDoc;

	// Get the doc container based on the location of this script in the DOM
	var thisScript = document.currentScript;
	var container = thisScript.parentElement;
	var tocContainer = document.querySelector('.docs .sidebar-right');

	// These are sources for github content. The CDNs will likely be faster than
	// raw.githubusercontent, and are not (as) rate limited.
	var sources = [
		'https://gitcdn.xyz/repo/',
		'https://rawcdn.githack.com/',
		'https://cdn.rawgit.com/',
		'https://raw.githubusercontent.com/'
	];

	// Load the scripts needed by the doc viewer
	inject('//cdn.polyfill.io/v2/polyfill.js?features=default,fetch',
		injected);
	inject('//cdnjs.cloudflare.com/ajax/libs/markdown-it/8.4.1/markdown-it.min.js',
		injected);
	inject('/js/highlight.pack.js', injected);

	/**
	 * Fetch a doc. The document text will be cached in session storage.
	 */
	function docFetch(path) {
		var cacheKey = 'repo-doc-cache/' + path;
		var cached = sessionStorage.getItem(cacheKey);
		if (cached) {
			return Promise.resolve(cached);
		}

		return sources.reduce(function (response, source) {
			return response.then(function (res) {
				return res;
			}, function () {
				return fetch(source + path)
					.then(function (response) {
						if (response.status !== 200) {
							throw new Error('Request to ' + source +
								' failed: ' + response.status);
						}
						return response.text();
					});
			});
		}, Promise.reject()).then(function (text) {
			sessionStorage.setItem(cacheKey, text);
			return text;
		});
	}

	/**
	 * Convert a doc ID (org/project/version) to a DOM-compatible ID
	 * (org__project__version)
	 */
	function docIdToDomId(docId) {
		return docId.replace(/\//g, '__');
	}

	/**
	 * Convert a DOC ID (org__project__version) to a doc ID
	 * (org/project/version)
	 */
	function domIdToDocId(domId) {
		return domId.replace(/__/g, '/');
	}

	/**
	 * Locate and remove a table-of-contents from a README. Return the TOC
	 * element.
	 */
	function extractToc(elem) {
		var child;

		// Look through the first few elements for a likely candidate
		for (var i = 0; i < 10; i++) {
			child = elem.children[i];
			if (child && isListOfLinks(child)) {
				child.parentNode.removeChild(child);
				return child;
			}
		}
	}

	/**
	 * Return a doc ID corresponding to a location or href string. Currently, a
	 * doc ID is just the hash part of a URL.
	 */
	function getDocId(locationOrHref) {
		var hash;

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
		return hash.split(sep)[0];
	}

	/**
	 * Return the current location has as a doc ID (org/project/version)
	 */
	function getHash() {
		return domIdToDocId(location.hash.slice(1));
	}

	/**
	 * Initialize the doc viewer
	 */
	function init() {
		initMarkdownRenderer();

		// Add listeners to intercept nav link clicks
		document.querySelectorAll('.repo-doc-link').forEach(function (link) {
			// Nav link hrefs are hashes; slice off the '#'
			docs.push(getDocId(link.getAttribute('href')));
		});

		window.addEventListener('hashchange', function (event) {
			event.preventDefault();
			var hash = getHash();

			if (hash === currentDoc) {
				// If the new hash is a base document ID, scroll back to the top
				// of the doc
				resetScroll();
			} else if (getDocId(hash) !== currentDoc) {
				// If the new hash doesn't match the current document, render
				// the new doc
				renderDoc(hash);
			} else {
				scrollTo('#' + docIdToDomId(hash));
			}

			// Otherwise just let the browser handle the event normally
		});

		// If the user clicks a heading, set the browser hash to the heading's
		// ID and scroll to it
		container.addEventListener('click', function (event) {
			const target = event.target;
			if (/H[2-4]/.test(target.tagName)) {
				setHash(target.id);
			}
		});

		// If the current path is a doc link, load the referenced doc
		var hash = getHash();
		if (hash) {
			renderDoc(hash);
		}
	}

	/**
	 * Create a markdown renderer
	 */
	function initMarkdownRenderer() {
		markdown = new window.markdownit({
			// Customize the syntax highlighting process
			highlight: function (str, lang) {
				var hljs = window.hljs;

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

		var rules = markdown.renderer.rules;

		// Keep a reference to the default link renderer to fallback to
		var defaultLinkRender =
			rules.link_open ||
			function (tokens, idx, options, _env, self) {
				return self.renderToken(tokens, idx, options);
			};

		// Make relative links (particularly TOC links) work properly
		rules.link_open = function (tokens, idx, options, env, self) {
			var hrefIdx = tokens[idx].attrIndex('href');
			var hrefToken = tokens[idx].attrs[hrefIdx];
			var hrefParts = hrefToken[1].split('#');
			var file = hrefParts[0];
			var hash = hrefParts[1];
			var domId = docIdToDomId(env.docId);

			if (!file) {
				// This is an in-page anchor link
				hrefToken[1] = '#' + domId + sep + hash;
			} else if (/github.com/.test(file)) {
				// This is a github link -- see if it's relative to our docs
				var match = /https?:\/\/github.com\/(\w+)\/(\w+)/.exec(file);
				if (match) {
					var repo = match[1] + '/' + match[2];
					for (var i = 0; i < docs.length; i++) {
						if (docs[i].indexOf(repo) === 0) {
							hrefToken[1] = '#' + docs[i] + sep + hash;
							break;
						}
					}
				}
			} else if (!/^https?:/.test(file)) {
				// This is a relative link
				hrefToken[1] = '#' + domId + '/' + file;
			}

			return defaultLinkRender(tokens, idx, options, env, self);
		};

		// Generate heading IDs for TOC links
		rules.heading_open = function (tokens, idx, _options, env) {
			var token = tokens[idx];
			var content = tokens[idx + 1].content;
			var id = content;
			var domId = docIdToDomId(env.docId);
			var anchorId = domId + sep + slugify(id);

			// Create a separate <a> link above the heading tag. This allows us
			// to position the anchor some distance above the heading, so that
			// when the user clicks an anchor link the heading itself will be
			// visible (not hidden under the top bar).
			// return '<a class="anchor" id="' + anchorId + '"></a><' + token.tag + '>';
			var icon = token.tag.toLowerCase() !== 'h1' ?
				'<span uk-icon="icon: link"></span>' :
				'';
			return '<' + token.tag + ' id="' + anchorId + '">' + icon;
		};
	}

	/**
	 * Dynamically inject a script into the page
	 */
	function inject(scriptUrl, loaded) {
		toLoad++;
		var script = document.createElement('script');
		script.onload = loaded;
		script.src = scriptUrl;
		document.head.appendChild(script);
	}

	/**
	 * Called when an injected script has loaded
	 */
	function injected() {
		loaded++;
		if (loaded === toLoad) {
			// When all injected modules have been loaded, init the doc viewer
			init();
		}
	}

	/**
	 * Return true if the given element appears to be a Table of Contents
	 */
	function isListOfLinks(elem) {
		if (elem.tagName !== 'UL') {
			return false;
		}

		var child = elem.firstElementChild;
		var link;
		var sublist;
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
			if (sublist && !isListOfLinks(sublist)) {
				return false;
			}
			child = child.nextElementSibling;
		}

		return true;
	}

	/**
	 * Create a Table of Contents for a doc
	 */
	function makeToc() {
		var headings = container.querySelectorAll('h2,h3,h4');

		var toc = document.createElement('ul');
		toc.classList.add('uk-nav');
		toc.classList.add('uk-nav-default');
		toc.setAttribute('uk-scrollspy-nav', 'closest: li; scroll: true; offset: 100');

		var lastItem;
		var level = 0;

		headings.forEach(function (heading) {
			var link = document.createElement('a');
			link.href = '#' + heading.id;
			link.textContent = heading.textContent;

			var item = document.createElement('li');
			item.appendChild(link);

			// Get the level of the current heading
			var headingLevel = Number(heading.tagName.slice(1)) - 2;

			if (!lastItem) {
				toc.appendChild(item);
			} else if (headingLevel === level) {
				lastItem.parentElement.appendChild(item);
			} else if (headingLevel > level) {
				var submenu = document.createElement('ul');
				submenu.classList.add('uk-nav-sub');
				submenu.classList.add('uk-nav-default');
				submenu.appendChild(item);
				lastItem.appendChild(submenu);
			} else {
				var parent = lastItem.parentElement;
				var hlvl = level;
				while (parent && hlvl > headingLevel) {
					parent = parent.parentElement.parentElement;
					hlvl--;
				}
				(parent || toc).appendChild(item);
			}

			lastItem = item;
			level = headingLevel;
		});

		// UIkit will emit a 'scrolled' event when 
		document.body.addEventListener('scrolled', function (event) {
			var hash = event.target.hasAttribute('href') ?
				event.target.getAttribute('href') :
				'#' + event.target.id;
			if (hash !== location.hash) {
				history.pushState({}, '', hash);
			}
		});

		return toc;
	}


	/**
	 * Render a README for a particular repo and version.
	 *
	 * A doc ID has the format '<org>/<repo>/<version>[/<path>]'. It looks like
	 * 'dojo/cli/master' or 'dojo/core/master/docs/math.md'.
	 */
	function renderDoc(hash) {
		var parts = hash.split(sep);
		var docId = parts[0];
		var idParts = docId.split('/');
		var repo = idParts[0] + '/' + idParts[1];
		var version = idParts[2];
		var path = idParts.slice(3).join('/') || 'README.md';

		return docFetch(repo + '/' + version + '/' + path)
			.then(function (text) {
				var content = markdown.render(text, { docId: docId });
				container.innerHTML = content;

				tocContainer.innerHTML = '';
				extractToc(container);
				var toc = makeToc();
				tocContainer.appendChild(toc);

				if (window.UIkit) {
					window.UIkit.scrollspyNav(toc);
				}

				if (path !== 'README.md') {
					// If we're not viewing the base README, add a link back to
					// the parent package to the top of the doc, just for
					// context.
					const breadcrumbs = document.createElement('div');
					const parent = document.createElement('a');
					parent.href = '#' + repo + '/' + version;
					parent.textContent = idParts[1];
					breadcrumbs.appendChild(parent);
					container.insertBefore(breadcrumbs, container.firstChild);
				}

				currentDoc = docId;

				if (hash.indexOf(sep) === -1) {
					resetScroll();
				} else {
					scrollTo('#' + docIdToDomId(hash));
				}
			});
	}

	/**
	 * Reset the page scroll position
	 */
	function resetScroll() {
		document.body.parentElement.scrollTop = 0;
	}

	/**
	 * Scroll to a given anchor
	 */
	function scrollTo(hash) {
		window.UIkit.scroll(hash, { offset: 100 }).scrollTo(hash);
	}

	/**
	 * Set the current location hash and scroll to the corresponding anchor
	 */
	function setHash(hash) {
		if (hash[0] !== '#') {
			hash = '#' + hash;
		}
		history.pushState({}, '', hash);
		scrollTo(hash);
	}

	/**
	 * Generate a standardized slug from a string. This attempts to follow
	 * GitHub's format so that it will match up with ref links in GitHub docs.
	 */
	function slugify(str) {
		return str
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^A-Za-z0-9_\- ]/g, '');
	}
})();
