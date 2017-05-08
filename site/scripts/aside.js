hexo.extend.tag.register('aside', function(args, content) {
	// replace backticks with <code> tags
	content = content && content.replace(/`(.*?)`/g, function (match, param) {
		return `<code>${param}</code>`;
	});
	return `<article class='aside'><strong>${args[0]}</strong><p>${content}</p></article>`;
}, {ends: true});
