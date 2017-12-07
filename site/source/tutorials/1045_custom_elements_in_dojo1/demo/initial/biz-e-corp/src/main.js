define([
	'./customElement!dojo2Widget/worker/worker.html',
	'dojo/domReady!'
], function(_WidgetBase) {
	return {
		start: function (rootNode) {
			var workerData = [
				{
					firstName: 'Tim',
					lastName: 'Jones'
				},
				{
					firstName: 'Alicia',
					lastName: 'Fitzgerald'
				},
				{
					firstName: 'Hans',
					lastName: 'Mueller'
				}
			];
			workerData.forEach(function(item) {
				var worker = document.createElement('myapp-worker');
				worker.firstName = item.firstName;
				worker.lastName = item.lastName;
				rootNode.appendChild(worker);
			}.bind(this));
		}
	};
});
