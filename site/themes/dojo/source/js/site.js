document.addEventListener('DOMContentLoaded', function () { 

	function addShowSolutionsListener() {
		var matches = document.body.matches || document.body.webkitMatchesSelector || document.body.mozMatchesSelector
			|| document.body.msMatchesSelector || document.body.webkitMatchesSelector || document.body.matchesSelector;
		document.querySelector('.page-content').addEventListener('click', function (event) {
			if (matches.call(event.target, 'button.toggle-solution')) {
				event.stopPropagation();
				var sectionId = event.target.getAttribute('data-target');
				var element = document.getElementById(sectionId);
				if (element) {
					var isHidden = element.classList.contains('hidden');
					element.classList[isHidden ? 'remove' : 'add']('hidden');
				}
			}
		});
	}

	if (document.querySelector('button.toggle-solution')) {
		addShowSolutionsListener();
	}

	(function () {
		var navBurger = document.querySelector('.header .navbar-burger');
		var navMenu = document.querySelector('.header .navbar-menu');
		navBurger.addEventListener('click', function () {
			navBurger.classList.toggle('is-active');
			navMenu.classList.toggle('is-active');
		});
	})();
});
