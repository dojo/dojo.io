hexo.extend.tag.register('task', function(args) {
	return `<div class="tags has-addons tasks"><div class="tag is-dark">Goal</div><div class="tag is-primary">${convertCodeAndLinks(args[0])}</div></div>`;
});

function convertCodeAndLinks(content) {
	// replace < with &lt; and > with &gt;
	content = content && content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

	// replace backticks with <code> tags
	content = content && content.replace(/`(.*?)`/g, function (match, param) {
		return `<code>${param}</code>`;
	});

	// replace markdown for hyperlink with proper HTML
	content = content && content.replace(/\[(.*?)\]\((.*?)\)/g, function (match, title, url) {
		return `<a href='${url}'>${title}</a>`;
	});

	return content;
}
