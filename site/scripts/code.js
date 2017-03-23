var fs = require('hexo-fs');
var pathFn = require('path');
var hljs = require('highlight.js');
var md = require('markdown-it')({
	html: true,
	linkify: false,
	typographer: false
}).use(require('markdown-it-highlightjs'));

hexo.extend.tag.register('codefile', function(args){
	var filename = args[0];
	var lang = args[1] ? args[1] : 'javascript';
	
	var path = pathFn.join(hexo.source_dir, filename);
	
	if (!path) return;
	
	return fs.readFile(path).then(function(content){
		highlighted = (hljs.highlight(lang, content));
		content = '<pre class="hljs"><code>' + highlighted.value + '</code></pre>';
		return content;
	});
}, {async: true});