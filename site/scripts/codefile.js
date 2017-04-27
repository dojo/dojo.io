// Hexo Tag Plugin
// Imports a code file and highlights the result.
// File path must be a child .md file.

/*
	Usage: {% include_codefile path/to/file/relative/filename.ts [lines:1-4,7]|[line:4] [lang:ts] %}
*/

var fs = require('hexo-fs');
var pathFn = require('path');
var Prism = require('prismjs');
var _ = require("lodash");


hexo.extend.tag.register('include_codefile', function(args) {
	var filename = args[0];
	var lang = false;
	var lines = false;
	var solution = false;
	var content = '';

	_.forEach(args.slice(1), function(arg){
		if(_.startsWith(arg, "lang:")) {
			lang = arg.replace("lang:", "");
		}
		if (_.startsWith(arg, "line")) {
			lines = arg.replace(/([a-zA-Z]+?)(s\b|\b):/gm, "");
			lines = cf.parseLinesRange(lines);
		}
		if(_.startsWith(arg, "solution:")) {
			solution = arg.replace("solution:", "");
		}
	});

	lang = lang ? lang : 'javascript';

	var rawContent = fs.readFileSync(cf.getFilePath(this.path, filename));

	if(lines !== false) {
	   content = cf.extractContent(rawContent, lines);
	} else {
		content = rawContent;
	}

   var highlighted = Prism.highlight(content, Prism.languages[lang]);
   var codeString = `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;

   if(solution) {
		return `<div class="solution-container"><button class="toggle-solution" data-target="${solution}">Toggle Solution</button><section id="${solution}" class="hidden">${codeString}</section></div>`;
   } else {
	   return codeString;
   }

}, { async: true });


var cf = {
	parseLinesRange: function (str) {
		var lines = {};
		var lineGroups;
		if (str.indexOf(',') !== -1) {
			lineGroups = str.split(',');
		} else {
			lineGroups = [str];
		}
		lineGroups.forEach(function (lineGroup) {
			if (lineGroup.indexOf("-") != -1) {
				var currentLines = lineGroup.split("-").map(function(v) {
					return parseInt(v, 10);
				});
				for (var i = currentLines[0]; i <= currentLines[1]; i++){
					lines[i-1] = true;
				}
			} else {
				lines[lineGroup - 1] = true;
			}
		});

		var result = Object.keys(lines).sort(function (l, r) {
			return parseInt(l, 10) - parseInt(r, 10);
		});
		return result;
	},

	getFilePath: function (path, filename) {
		var dir = path.split('/').slice(0, -1).join('/');
		return pathFn.join(hexo.source_dir, dir, filename);
	},

	extractContent: function (rawContent, lines) {
		var linefeed = rawContent.indexOf('\r\n') !== -1 ? '\r\n' : '\n';
		var splitContent = rawContent.split(linefeed)
		var fragment = '';

		if (_.isArray(lines)) {
			var lineStart = lines[0];
			var lineEnd = lines[1];
			var arrContent = [];
			lines.forEach(function (line) {
				fragment += splitContent[line] + linefeed;
			});
		} else {
			fragment = splitContent[lines];
		}

		return fragment;
	}
}