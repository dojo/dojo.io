(function () {
	// Number of scripts to load; incremented by `inject`
	var toLoad = 0;
	// Number of scripts loaded; incremented by `injected`
	var loaded = 0;

	// The markdown renderer
	var markdown;

	// Used to separate the document ID from an in-page anchor ID
	var sep = '!';

	// The list of available doc IDs
	var docs = [];

	// The currently visible doc
	var currentDoc;

	// Get the doc container based on the location of this script in the DOM
	var thisScript = document.currentScript;
	var container = thisScript.parentElement;

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
	 * Return a doc ID corresponding to a location or href string. Currently, a
	 * doc ID is just the hash part of a URL.
	 */
	function getDocId(locationOrHref) {
		var hash;
		if (typeof locationOrHref === 'string') {
			hash = locationOrHref.slice(locationOrHref.indexOf('#') + 1);
		} else {
			hash = locationOrHref.hash.slice(1);
		}

		// If the link references an in-page anchor, it will contain a `sep`
		return hash.split(sep)[0];
	}

	/**
	 * Initialize the doc viewer
	 */
	function init() {
		initMarkdownRenderer();

		// Add listeners to intercept nav link clicks
		document.querySelectorAll('.repo-doc-link').forEach(function (link) {
			// Nav link hrefs are hashes; slice off the '#'
			var hash = link.getAttribute('href').slice(1);

			var linkDocId = getDocId(hash);
			docs.push(linkDocId);
		});

		window.addEventListener('hashchange', function (event) {
			var hash = location.hash.slice(1);

			if (hash === currentDoc) {
				// If the new hash is a base document ID, scroll back to the top
				// of the doc
				event.preventDefault();
				resetScroll();
			} else if (getDocId(hash) !== currentDoc) {
				// If the new hash doesn't match the current document, render
				// the new doc
				event.preventDefault();
				renderDoc(hash);
			}

			// Otherwise just let the browser handle the event normally
		});


		// If the current path is a doc link, load the referenced doc
		if (location.hash) {
			renderDoc(location.hash);
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
			var docId = env.docId;

			if (!file) {
				// This is an in-page anchor link
				hrefToken[1] = '#' + docId + sep + hash;
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
				hrefToken[1] = '#' + docId + '/' + file;
			}

			return defaultLinkRender(tokens, idx, options, env, self);
		};

		// Generate heading IDs for TOC links
		rules.heading_open = function (tokens, idx, _options, env) {
			var token = tokens[idx];
			var content = tokens[idx + 1].content;
			var id = content;
			var docId = env.docId;
			var anchorId = docId + sep + slugify(id);

			// Create a separate <a> link above the heading tag. This allows us
			// to position the anchor some distance above the heading, so that
			// when the user clicks an anchor link the heading itself will be
			// visible (not hidden under the top bar).
			return '<a class="anchor" id="' + anchorId + '"></a><' + token.tag + '>';
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
	 * Render a README for a particular repo and version.
	 *
	 * A doc ID has the format '<org>/<repo>/<version>'. It looks like
	 * 'dojo/cli/master'.
	 */
	function renderDoc(hash) {
		// Remove a leading #
		hash = hash.replace(/^#/, '');

		var parts = hash.split(sep);
		var docId = parts[0];
		var idParts = docId.split('/');
		var repo = idParts[0] + '/' + idParts[1];
		var version = idParts[2];
		var path = idParts.slice(3).join('/') || 'README.md';

		// Set the location hash to the base document ID. It will be set back to
		// its original value once the document is rendered.
		location.hash = '#' + parts[0];

		return docFetch(repo + '/' + version + '/' + path)
			.then(function (text) {
				var content = markdown.render(text, { docId: docId });
				container.innerHTML = content;
				currentDoc = docId;
				resetScroll();

				// Now that the page is loaded, reset the location hash to its
				// original value so that the browser will scroll to any anchor
				// indicated by the hash
				location.hash = hash;
			});
	}

	/**
	 * Reset the page scroll position
	 */
	function resetScroll() {
		document.body.parentElement.scrollTop = 0;
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
