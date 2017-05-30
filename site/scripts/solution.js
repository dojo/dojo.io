var Prism = require('prismjs');
var _ = require('lodash');

hexo.extend.tag.register('solution', ([name], text) => {

	lang = 'javascript';
	text = text.replace(/^```.*$/gm, '');
	text = text.replace(/s*/, "");
	var content = Prism.highlight(text, Prism.languages[lang]);

	return `<div class="solution-container"><button class="toggle-solution" data-target="${name}">Toggle Solution</button><section id="${name}" class="hidden"><pre class="language-${lang}"><code>${content}</code></pre></section></div>`;
}, { ends: true });
