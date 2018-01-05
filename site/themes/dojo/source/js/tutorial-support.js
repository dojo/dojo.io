var tutorial = tutorial || {};

tutorial.populatePaginator = function(container, title) {
	if (!container || !container.appendChild) {
		console.error('Invalid container received');
		return;
	}

	var breadcrumbs = document.querySelector('.breadcrumb');
	var currentStepLabel = document.querySelector('.step-current');

	var sectionOneContainer = document.querySelector('.section-one');

	var otherSectionContainer = document.querySelector('.paginator');
	otherSectionContainer.classList.add('pagination', 'hidden');

	var ownEditorButton = document.querySelector('.begin-button');

	var sections = document.querySelectorAll('section.tutorial');
	var sectionContainer = document.querySelector('.pagination');
	var centerSectionContainer = document.querySelector('.pagination-list');

	var backButton = document.querySelector('.pagination-previous');
	var nextButton = document.querySelector('.pagination-next');

	var timeoutHandle;

	var sectionSelectors = [];

	// create each section selector and link it to its section via data-section-num

	if (sections.length > 0) {
		for (var i = 0; i < sections.length; i++) {
			sections[i].setAttribute('data-section-num', i);
			if (i === 0) {
				sections[i].classList.remove('hidden', 'hiding');
				continue;
			}
			var sectionSelectorWrap = document.createElement('li');
			sectionSelectorWrap.className = 'pagination-item';

			var sectionSelector = document.createElement('a');
			sectionSelector.setAttribute('data-section-num', i);
			sectionSelector.className = 'pagination-link';
			sectionSelector.innerHTML = i;
			var title = sections[i].querySelector('h2');

			if (title) {
				sectionSelector.title = title.textContent;
			}

			sectionSelectorWrap.appendChild(sectionSelector);
			centerSectionContainer.appendChild(sectionSelector);
			sectionSelectors.push(sectionSelector);
		}
	}

	ownEditorButton.addEventListener('click', function () {
		activateSelector(document.querySelector('.pagination-link[data-section-num="1"]'));
	});

	centerSectionContainer.addEventListener('click', function (e) {
		var target = e.target;
		// short-circuit if clicked section is already active
		if (target.classList.contains('is-current')) {
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

	function activateSelector(target, shouldSkipHistoryUpdate) {
		var sectionToActivate = (target.getAttribute && target.getAttribute('data-section-num')) || target;
		if (!shouldSkipHistoryUpdate && window.history.state !== sectionToActivate) {
			window.history.pushState(sectionToActivate, '', '#' + sectionToActivate);
		}

		sectionSelectors.forEach(function (sectionSelector) {
			if (sectionSelector === target) {
				sectionSelector.classList.add('is-current');
				currentStepLabel.innerHTML = sectionSelector.title;
			} else {
				sectionSelector.classList.remove('is-current');

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

		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
			timeoutHandle = null;
		}

		timeoutHandle = setTimeout(function (sectionToActivate) {
			for (var i = 0; i < sections.length; i++) {
				var section = sections[i];
				if (section.getAttribute('data-section-num') === sectionToActivate) {
					section.classList.remove('hiding');
				} else {
					section.classList.add('hidden');
				}
			}
			document.querySelector('.content-wrapper').scrollTop = 0;

			var sectionToActivateNum = sectionToActivate && parseInt(sectionToActivate, 10);
			if (sectionToActivateNum === sections.length - 1) {
				nextButton.classList.add('hidden');
			} else {
				nextButton.classList.remove('hidden');
			}
			if (!sectionToActivateNum) {
				sectionOneContainer.classList.remove('hidden');
				otherSectionContainer.classList.add('hidden');
				breadcrumbs.classList.add('hidden');
			} else {
				sectionOneContainer.classList.add('hidden');
				otherSectionContainer.classList.remove('hidden');
				breadcrumbs.classList.remove('hidden');
			}
		}, 300, sectionToActivate);
	}

	function navigate(moveBy) {
		var activeSelector = document.querySelector('.pagination-link.is-current');
		var sectionNumber = 0;
		if (activeSelector) {
			sectionNumber = parseInt(activeSelector.getAttribute('data-section-num'), 10) + moveBy;
		} else {
			sectionNumber = 1;
		}
		var newSelector = document.querySelector('.pagination-link[data-section-num="' + sectionNumber + '"]');
		activateSelector(newSelector || '0');
	}

	function parseActiveSection() {
		var urlSectionSegment = window.location.href.split('/').pop();
		var includesSection = urlSectionSegment && urlSectionSegment[0] === '#';
		var pageSection = (includesSection && urlSectionSegment.slice(1)) || '0';
			activateSelector(
				document.querySelector('.pagination-link[data-section-num="' + pageSection + '"]') || pageSection,
				!includesSection
			);

	}
};
