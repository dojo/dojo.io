hexo.extend.tag.register('section', function(args) {
	var result = '<section class="tutorial hidden hiding">';
	switch (args[0]) {
		case 'first':
			// no-op
			break;
		case 'last':
			result = '</section>';
			break;
		default:
			result = '</section>' + result;
	}

	return result;
});
