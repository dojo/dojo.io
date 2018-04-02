(function () {
	var loadCount = 0;
	var thisScript = document.currentScript;
	var sources = [
		'https://gitcdn.xyz/repo/',
		'https://rawcdn.githack.com/',
		'https://cdn.rawgit.com/',
		'https://raw.githubusercontent.com/'
	];

	inject('https://cdn.polyfill.io/v2/polyfill.js?features=default,fetch', loaded);
	inject('https://cdnjs.cloudflare.com/ajax/libs/markdown-it/8.4.1/markdown-it.min.js', loaded);

	function loaded() {
		loadCount++;
		if (loadCount === 2) {
			renderDoc();
		}
	}

	function renderDoc() {
		var repo = thisScript.getAttribute('data-repo');
		var version = thisScript.getAttribute('data-version') || 'master';

		docFetch(repo + '/' + version + '/README.md')
			.then(function (text) {
				var md = new window.markdownit();
				var content = md.render(text);
				thisScript.parentElement.innerHTML = content;
			});
	}

	function docFetch(path) {
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
		}, Promise.reject());
	}

	function inject(scriptUrl, loaded) {
		var script = document.createElement('script');
		script.onload = loaded;
		script.src = scriptUrl;
		document.head.appendChild(script);
	}
})();
