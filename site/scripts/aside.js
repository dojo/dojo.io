hexo.extend.tag.register('aside', function(args, content) {
	return `<article class='aside'>${content}</article>`;
}, {ends: true});