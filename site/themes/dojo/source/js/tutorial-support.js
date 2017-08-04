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

	var backButton = document.createElement('button');
	backButton.classList.add('previous', 'green');
	backButton.innerHTML = 'Back';
	otherSectionContainer.appendChild(backButton);

	var sections = document.querySelectorAll('section.tutorial');
	var sectionContainer = document.createElement('div');
	var centerSectionContainer = document.createElement('div');
	centerSectionContainer.className = 'center-section-container';
	sectionContainer.className = 'section-container';

	sectionContainer.appendChild(centerSectionContainer);
	otherSectionContainer.appendChild(sectionContainer);

	var nextButton = document.createElement('button');
	nextButton.classList.add('next', 'green');
	nextButton.innerHTML = 'Next';
	otherSectionContainer.appendChild(nextButton);

	var sectionSelectors = [];

	// create each section selector and link it to its section via data-section-num
	if (sections.length > 0) {
		for (var i = 0; i < sections.length; i++) {
			sections[i].setAttribute('data-section-num', i);
			if (i === 0) {
				sections[i].classList.remove('hidden', 'hiding');
				continue;
			}
			var sectionSelector = document.createElement('div');
			sectionSelector.setAttribute('data-section-num', i);
			sectionSelector.className = 'section-selector';
			var title = sections[i].querySelector('h2');
			if (title) {
				sectionSelector.title = title.textContent;
			}

			centerSectionContainer.appendChild(sectionSelector);
			sectionSelectors.push(sectionSelector);
		}
	}

	ownEditorButton.addEventListener('click', function () {
		activateSelector(document.querySelector('.section-selector[data-section-num="1"]'));
	});

	centerSectionContainer.addEventListener('click', function (e) {
		var target = e.target;
		// short-circuit if clicked section is already active
		if (target.classList.contains('active')) {
			return;
		}
		activateSelector(target);
	});

	backButton.addEventListener('click', function () {
		navigate(-1);
	});

	nextButton.addEventListener('click', function () {
		navigate(1);
	});

	parseActiveSection();
	window.addEventListener('hashchange', parseActiveSection);

	function activateSelector(target) {
		var sectionToActivate = (target.getAttribute && target.getAttribute('data-section-num')) || target;
		if (window.history.state !== sectionToActivate) {
			window.history.pushState(sectionToActivate, '', '#' + sectionToActivate);
		}

		sectionSelectors.forEach(function (sectionSelector) {
			if (sectionSelector === target) {
				sectionSelector.classList.add('active');
			} else {
				sectionSelector.classList.remove('active');
			}
		});

		for (var i = 0; i < sections.length; i++) {
			var section = sections[i];
			const sectionNum = section.getAttribute('data-section-num');
			if (sectionNum === sectionToActivate) {
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

			var sectionToActivateNum = sectionToActivate && parseInt(sectionToActivate, 10);
			if (sectionToActivateNum === sections.length - 1) {
				nextButton.classList.add('hidden');
			} else {
				nextButton.classList.remove('hidden');
			}
			if (!sectionToActivateNum) {
				sectionOneContainer.classList.remove('hidden');
				otherSectionContainer.classList.add('hidden');
			} else {
				sectionOneContainer.classList.add('hidden');
				otherSectionContainer.classList.remove('hidden');
			}
		}, 300, sectionToActivate);
	}

	function navigate(moveBy) {
		var activeSelector = document.querySelector('.section-selector.active');
		var sectionNumber = 0;
		if (activeSelector) {
			sectionNumber = parseInt(activeSelector.getAttribute('data-section-num'), 10) + moveBy;
		} else {
			sectionNumber = 1;
		}
		var newSelector = document.querySelector('.section-selector[data-section-num="' + sectionNumber + '"]');
		activateSelector(newSelector || '0');
	}

	function parseActiveSection() {
		var urlSectionSegment = window.location.href.split('/').pop();
		var pageSection = (urlSectionSegment && urlSectionSegment[0] === '#' && urlSectionSegment.slice(1)) || '0';
		activateSelector(
			document.querySelector('.section-selector[data-section-num="' + pageSection + '"]') || pageSection
		);

	}
};
