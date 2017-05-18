hexo.extend.tag.register('section', function(args) {
	var result = '<section class="tutorial hidden hiding">';
	switch (args[0]) {
		case 'start':
			// no-op
			break;
		case 'end':
			result = '</section>';
			break;
		default:
			result = '</section>' + result;
	}

	return result;
});
