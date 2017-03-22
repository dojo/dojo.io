document.addEventListener('DOMContentLoaded', function () { 
	var headroom = new Headroom(document.querySelector(".site-header"), {
		"offset": 150,
		tolerance: {
			up: 15,
			down: 0
		},
		"classes": {
			"initial": "animated",
			"pinned": "slideDown",
			"unpinned": "slideUp"
		}
	});

	headroom.init();
});