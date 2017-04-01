// Hexo Tag Plugin
// Imports a code file and highlights the result.
// File path must be a child .md file.

var fs = require('hexo-fs');
var pathFn = require('path');
var Prism = require('prismjs');
var _ = require("lodash");

var cf = {
    parseLinesRange: function(str) {
        
        var lines = (typeof str !== 'undefined') ? str : false;
        
        if (str.indexOf("-") != -1) {
            lines = str.split("-");
            lines[0] = (lines[0]) - 1;
        } else {
            lines = (str) -1;
        }
        
        return lines;
    },

    getFilePath: function(path, filename) {
        var dir = path.split('/').slice(0, -1).join('/');
        return pathFn.join(hexo.source_dir, dir, filename);
    }
}

hexo.extend.tag.register('include_codefile', function(args) {
    var filename = args[0];
    var lang;
    var lines;

    _.forEach(args.slice(1), function(arg){
        if(_.startsWith(arg, "lang:")) {
            lang = arg.replace("lang:", "");
        }
        if(_.startsWith(arg, "lines:")){ 
            lines = arg.replace("lines:", "");
        }
    });

    lines = cf.parseLinesRange(lines);
    lang = (typeof lang !== 'undefined') ? lang : 'javascript';

    var content = '';
    var rawContent = fs.readFileSync(cf.getFilePath(this.path, filename));
    
    
    if(lines) {
        var linefeed = rawContent.indexOf('\r\n') !== -1 ? '\r\n' : '\n';
        var splitContent = rawContent.split(linefeed)
        
        if(_.isArray(lines)) {
            var lineStart = lines[0];
            var lineEnd = lines[1];
            var arrContent = splitContent.slice(lineStart, lineEnd);
            _.each(arrContent, function (ln) {
                content += ln + linefeed;
            });
        } else {
            var content = splitContent[lines];
        }
    } else {
        content = rawContent;
    }

   var highlighted = Prism.highlight(content, Prism.languages[lang]);
   return `<pre class="language-${lang}"><code>${highlighted}</code></pre>`;

}, { async: true });

