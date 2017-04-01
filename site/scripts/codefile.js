// Hexo Tag Plugin
// Imports a code file and highlights the result.
// File path must be a child .md file.

var fs = require('hexo-fs');
var pathFn = require('path');
var Prism = require('prismjs');
var _ = require("lodash");

hexo.extend.tag.register('codefile', function(args) {
    var content;
    var lang;
    var lines;

    // Create object from passed in args
    var tagArgs = {};
    _.forEach(args, function(arg) {
        var split = arg.split(":");
        _.set(tagArgs, split[0], split[1]);
    });

    // Create file path string
    var dir = (this.path.split('/'));
    dir = dir.slice(0, dir.length - 1).toString().replace(/,/g, "/");
    var path = pathFn.join(hexo.source_dir, dir, tagArgs.file);

    // Check if language was passed in
    lang = tagArgs.lang ? tagArgs.lang : "javascript"

    // Check if file exists
    if (fs.existsSync(path)) {
        raw = fs.readFileSync(path);
    } else {
        return;
    }

    // Check if range passed
    if (tagArgs.lines) {
        var lineStart = tagArgs.lines.split("-")[0];
        var lineEnd = tagArgs.lines.split("-")[1];
        var split = raw.split("\n").slice(lineStart, lineEnd);

        _.each(split, function(v) {
            content += v + "\n";
        });
        console.log(content);
    } else {
        content = raw;
    }

    var highlighted = Prism.highlight(content, Prism.languages[lang]);
    return `<pre class="language-${lang}"><code>${highlighted}</code></pre>`;

}, { async: true });