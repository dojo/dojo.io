// Hexo Tag Plugin
// Imports a code file and highlights the result.
// File path must be a child .md file.

var fs = require('hexo-fs');
var pathFn = require('path');
var Prism = require('prismjs');

hexo.extend.tag.register('codefile', function(args){
	var filename = args[0];
	var lang = args[1] ? args[1] : 'javascript';
	
	if (!filename) return;
	
	var dir = (this.path.split('/'));
	dir = dir.slice(0, dir.length-1).toString().replace(/,/g , "/");
	
	var path = pathFn.join(hexo.source_dir, dir, filename);
	
	return fs.readFile(path).then(function(content){
		lang = 'javascript';
		var highlighted = Prism.highlight(content, Prism.languages[lang]);
		return '<pre class="language-'+lang+'"><code>'+highlighted+'</code></pre>';
	});
}, {async: true});