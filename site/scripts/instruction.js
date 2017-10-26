hexo.extend.tag.register('instruction', function(args) {
	return `<div class="instruction">${convertCodeAndLinks(args[0])}</div>`;
});

function convertCodeAndLinks(content) {
	// replace < with &lt; and > with &gt;
	content = content && content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

	// replace single asterisks with <em> tag
	content = content && content.replace(/\*(.*?)\*/g, function (match, content) {
		return `<em>${content}</em>`;
	});

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
