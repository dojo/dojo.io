// Hexo Tag Plugin
// Imports a code file and highlights the result.
// File path must be a child .md file.

/*
	Usage: {% include_codefile path/to/file/relative/filename.ts [lines:1-4,7]|[line:4] [lang:ts] %}
*/

var fs = require("hexo-fs");
var pathFn = require("path");
var hljs = require("highlight.js");
var _ = require("lodash");

hexo.extend.tag.register(
	"include_codefile",
	function(args) {
		var filename = args[0];
		var lang = false;
		var lines = false;
		var content = "";

		_.forEach(args.slice(1), function(arg) {
			if (_.startsWith(arg, "lang:")) {
				lang = arg.replace("lang:", "");
			}
			if (_.startsWith(arg, "line")) {
				lines = arg.replace(/([a-zA-Z]+?)(s\b|\b):/gm, "");
				lines = cf.parseLinesRange(lines);
			}
		});

		lang = lang ? lang : "javascript";

		var rawContent = fs.readFileSync(cf.getFilePath(this.path, filename));

		if (lines !== false) {
			content = cf.extractContent(rawContent, lines);
		} else {
			content = rawContent;
		}

		content = cf.normalizeWhitespace(content);

		var { value: highlighted } = hljs.highlight(lang, content);
		return `<pre class="hljs language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
	},
	{ async: true }
);

var cf = {
	normalizeWhitespace(str) {
		const minSpaceMatch = str.match(/^[ \t]*(?=\S)/gm);
		const indent = minSpaceMatch
			? Math.min(...minSpaceMatch.map(x => x.length))
			: 0;

		if (indent === 0) {
			return str;
		}

		const re = new RegExp(`^[ \\t]{${indent}}`, "gm");

		return str.replace(re, "");
	},
	parseLinesRange(str) {
		var lines = {};
		var lineGroups;
		if (str.indexOf(",") !== -1) {
			lineGroups = str.split(",");
		} else {
			lineGroups = [str];
		}
		lineGroups.forEach(function(lineGroup) {
			if (lineGroup.indexOf("-") != -1) {
				var currentLines = lineGroup.split("-").map(function(v) {
					return parseInt(v, 10);
				});
				for (var i = currentLines[0]; i <= currentLines[1]; i++) {
					lines[i - 1] = true;
				}
			} else {
				lines[lineGroup - 1] = true;
			}
		});

		var result = Object.keys(lines).sort(function(l, r) {
			return parseInt(l, 10) - parseInt(r, 10);
		});
		return result;
	},

	getFilePath(path, filename) {
		var dir = path
			.split("/")
			.slice(0, -1)
			.join("/");
		return pathFn.join(hexo.source_dir, dir, filename);
	},

	extractContent(rawContent, lines) {
		var linefeed = rawContent.indexOf("\r\n") !== -1 ? "\r\n" : "\n";
		var splitContent = rawContent.split(linefeed);
		var fragment = "";

		if (_.isArray(lines)) {
			var lineStart = lines[0];
			var lineEnd = lines[1];
			var arrContent = [];
			lines.forEach(function(line) {
				fragment += splitContent[line] + linefeed;
			});
		} else {
			fragment = splitContent[lines];
		}

		return fragment;
	}
};
