/* global hexo */
/*'use strict';
const _ = require('lodash');
const htmlparser = require('htmlparser2');
const domutils = require('domutils');
var select = require('soupselect').select;


hexo.extend.generator.register('excerpt', function(db) {
    let nodeLength = 10;
    let config = this.config;

    if (config && config.excerpt_depth) {
        nodeLength = parseInt(config.excerpt_depth);
    }
    //console.log(domutils.findOne('#Overview > p'));
    //console.log(_.keys(db.pages.data[0]));
    //console.log(db.pages.data[0].layout);

    var pages = _.filter(db.pages.data, ['layout', 'tutorial'])

    return pages.map(post => {

        //honour the <!-- more --> !!!
        if (/<!-- more -->/.test(post.content)) {
            return {
                path: post.path,
                data: post,
                layout: post.layout
            };
        }

        let nodes = [];

        let parser = new htmlparser.Parser(new htmlparser.DomHandler((err, dom) => {
            if (!err) {
                nodes = dom;
                console.log(dom);
                //var elms = select(dom, "#Overview");
                console.log(dom);

            }
        }), {
            decodeEntities: false
        });

        parser.write(post.content);
        parser.done();

        // tracks how many tag nodes we found
        let stopIndex = 1;
        // tracks how many nodes we found in total
        let index = 0;
        for (; index < nodes.length && stopIndex <= nodeLength; index++) {
            if (nodes[index].type === 'tag') {
                stopIndex++;
            }
        }

        // set correct excerpt and more nodes values
        let excerptNodes = nodes.slice(0, index);
        let moreNodes = nodes.slice(index);
        post.excerpt = (excerptNodes.map(node => domutils.getOuterHTML(node))).join('');
        post.more = (moreNodes.map(node => domutils.getOuterHTML(node))).join('');



        return {
            path: post.path,
            data: post,
            layout: post.layout
        };
    });
});


/*var _ = require("lodash");
hexo.extend.helper.register('excerpt', function(content) {
    console.log(_.keys(content));
    //console.log(type);
});*/