hexo.extend.tag.register('aside', function(args, content) {
	return `<article class='aside'><strong>${args[0]}</strong><p>${content}</p></article>`;
}, {ends: true});