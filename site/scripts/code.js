var fs = require('hexo-fs');
var pathFn = require('path');
var hljs = require('highlight.js');
const url = require('url');

var md = require('markdown-it')({
	html: true,
	linkify: false,
	typographer: false
}).use(require('markdown-it-highlightjs'));

hexo.extend.tag.register('codefile', function(args){
	var filename = args[0];
	var lang = args[1] ? args[1] : 'javascript';
	
	if (!filename) return;
	
	var dir = (this.path.split('/'));
	dir = dir.slice(0, dir.length-1).toString().replace(/,/g , "/");
	
	var path = pathFn.join(hexo.source_dir, dir, filename);
	
	return fs.readFile(path).then(function(content){
		highlighted = (hljs.highlight(lang, content));
		content = '<pre class="hljs"><code>' + highlighted.value + '</code></pre>';
		return content;
	});
}, {async: true});