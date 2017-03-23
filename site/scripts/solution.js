hexo.extend.tag.register('solution', ([name], text) => {
	const content = hexo.render.renderSync({ text, engine: 'markdown' });
	return `<button class="toggle-solution" data-target="${name}">Toggle Solution</button>
		<section id="${name}" class="hidden">${content}</section>`;
}, { ends: true });
