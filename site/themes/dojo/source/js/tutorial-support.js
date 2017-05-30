var tutorial = tutorial || {};

tutorial.populateActionBar = function(container) {
	if (!container || !container.appendChild) {
		console.error('Invalid container received');
		return;
	}

	var sectionOneContainer = document.createElement('div');
	sectionOneContainer.classList.add('section-one');

	var otherSectionContainer = document.createElement('div');
	otherSectionContainer.classList.add('other-section', 'hidden');

	container.appendChild(sectionOneContainer);
	container.appendChild(otherSectionContainer);

	var ownEditorButton = document.createElement('button');
	ownEditorButton.classList.add('own-editor', 'blue');
	ownEditorButton.innerHTML = 'Begin tutorial';
	sectionOneContainer.appendChild(ownEditorButton);

	var sections = document.querySelectorAll('section.tutorial');
	var sectionContainer = document.createElement('div');
	sectionContainer.className = 'section-container';
	otherSectionContainer.appendChild(sectionContainer);

	var nextButton = document.createElement('button');
	nextButton.classList.add('next', 'green');
	nextButton.innerHTML = 'Next';
	otherSectionContainer.appendChild(nextButton);

	var sectionSelectors = [];

	// create each section selector and link it to its section via data-section-num
	if (sections.length > 0) {
		for (var i = 0; i < sections.length; i++) {
			if (i === 0) {
				sections[i].classList.remove('hidden', 'hiding');
				continue;
			}
			sections[i].setAttribute('data-section-num', i);
			var sectionSelector = document.createElement('div');
			sectionSelector.setAttribute('data-section-num', i);
			sectionSelector.className = 'section-selector';
			var title = sections[i].querySelector('h2');
			if (title) {
				sectionSelector.title = title.textContent;
			}

			sectionContainer.appendChild(sectionSelector);
			sectionSelectors.push(sectionSelector);
		}
	}

	ownEditorButton.addEventListener('click', function () {
		sectionOneContainer.classList.add('hidden');
		otherSectionContainer.classList.remove('hidden');
		activateSelector(document.querySelector('.section-selector[data-section-num="1"]'));
	});

	sectionContainer.addEventListener('click', function (e) {
		var target = e.target;
		// short-circuit if clicked section is already active
		if (target.classList.contains('active')) {
			return;
		}
		activateSelector(target);
	});

	nextButton.addEventListener('click', function () {
		var activeSelector = document.querySelector('.section-selector.active');
		var sectionNumber = 0;
		if (activeSelector) {
			sectionNumber = parseInt(activeSelector.getAttribute('data-section-num'), 10) + 1;
		} else {
			sectionNumber = 1;
		}
		var newSelector = document.querySelector('.section-selector[data-section-num="' + sectionNumber + '"]');
		if (!newSelector) {
			return;
		}
		activateSelector(newSelector);



	});

	function activateSelector(target) {
		var sectionToActivate = target.getAttribute('data-section-num');

		sectionSelectors.forEach(function (sectionSelector) {
			if (sectionSelector === target) {
				sectionSelector.classList.add('active');
			} else {
				sectionSelector.classList.remove('active');
			}
		});

		for (var i = 0; i < sections.length; i++) {
			var section = sections[i];
			if (section.getAttribute('data-section-num') === sectionToActivate) {
				section.classList.remove('hidden');
			} else {
				section.classList.add('hiding');
			}
		}

		setTimeout(function (sectionToActivate) {
			for (var i = 0; i < sections.length; i++) {
				var section = sections[i];
				if (section.getAttribute('data-section-num') === sectionToActivate) {
					section.classList.remove('hiding');
				} else {
					section.classList.add('hidden');
				}
			}
			document.querySelector('.scrollable').scrollTop = 0;

			if (parseInt(sectionToActivate, 10) === sections.length - 1) {
				nextButton.classList.add('hidden');
			} else {
				nextButton.classList.remove('hidden');
			}
		}, 300, sectionToActivate);
	}

}
