(function () {
	var loadCount = 0;
	var thisScript = document.currentScript;

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
		fetch('https://raw.githubusercontent.com/' + repo + '/master/README.md')
			.then(function (response) {
				return response.text();
			})
			.then(function (text) {
				var md = new window.markdownit();
				var content = md.render(text);
				thisScript.parentElement.innerHTML = content;
			});
	}

	function inject(scriptUrl, loaded) {
		var script = document.createElement('script');
		script.onload = loaded;
		script.src = scriptUrl;
		document.head.appendChild(script);
	}
})();
