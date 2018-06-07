// Hexo Tag Plugin
// Imports a code file and highlights the result.
// File path must be a child .md file.

/*
	Usage: {% include_codefile path/to/file/relative/filename.ts [lines:1-4,7]|[line:4] [highlight:1-2,7] [title:'text/HTML appears at top of block'] [note:'text/HTML appears at bottom of block'] [lang:ts] %}
*/

var fs = require("hexo-fs");
var pathFn = require("path");
var Prism = require("prismjs");
const loadLanguages = require('prismjs/components/index.js');
var _ = require("lodash");

loadLanguages(['typescript', 'json', 'bash', 'jsx', 'tsx']);

hexo.extend.tag.register(
	"include_codefile",
	function(args) {
		var filename = args[0];
		var lang = false;
		var lines = false;
		var highlighted = false;
		var highlightedLines = false;
		var title = "";
		var note = "";
		var content = "";

		_.forEach(args.slice(1), function(arg) {
			if (_.startsWith(arg, "lang:")) {
				lang = arg.replace("lang:", "");
			}
			if (_.startsWith(arg, "line")) {
				lines = arg.replace(/([a-zA-Z]+?)(s\b|\b):/gm, "");
				lines = cf.parseLinesRange(lines);
			}
			if(_.startsWith(arg, "highlight:")) {
				highlighted = arg.replace("highlight:", "");
				highlighted = cf.parseLinesRange(highlighted, true);
			}

			if(_.startsWith(arg, "title:")) {
				title = arg.replace(/(^title:\'?)|(\'$)/gm, "");
				title = `<div class="prism-code-title">${title}</div>`;
			}

			if(_.startsWith(arg, "note:")) {
				note = arg.replace(/(^note:\'?)|(\'$)/gm, "");
				note = `<div class="prism-code-note">${note}</div>`;
			}
		});

		lang = lang ? lang : "javascript";

		var rawContent = fs.readFileSync(cf.getFilePath(this.path, filename));

		if (lines !== false) {
			content = cf.extractContent(rawContent, lines);
		} else {
			content = rawContent;
		}

		var prismHtml = Prism.highlight(cf.normalizeWhitespace(content), Prism.languages[lang]);

		if(highlighted) {
			highlightedLines = cf.adjustHighlightedLineNumbers(highlighted, lines);
			prismHtml = cf.highlightHtml(prismHtml, highlightedLines);
		}

		return `<pre class="language-${lang}">${title}<code class="language-${lang}">${prismHtml}</code>${note}</pre>`;
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
	parseLinesRange(str, returnMap) {
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

		if(returnMap) {
			var result = lines;
		} else {
			var result = Object.keys(lines).sort(function (l, r) {
				return parseInt(l, 10) - parseInt(r, 10);
			});
		}

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
	},

	adjustHighlightedLineNumbers(highlightedLines, lines) {
		var linesToHighlight = {};
		if(lines) {
			for (var i = 0; i < lines.length; i++) {
				if (highlightedLines[lines[i]]) {
					linesToHighlight[i + 1] = true;
				}
			}
		} else {
			_.forEach(highlightedLines, function(line, key) {
				linesToHighlight[parseInt(key, 10) + 1] = true;
			})
		}
		return linesToHighlight;
	},

	highlightHtml(html, lines) {
		var lineNumber = 1;
		var highlighted = [];

		_.forEach(html.split("\n"), function(line) {
			if(lines[lineNumber++]) {
				highlighted.push(`<span class="line-highlight">${line}</span>`);
			} else {
				highlighted.push(line);
			}
		});
		return highlighted.join("\n");
	}
};
