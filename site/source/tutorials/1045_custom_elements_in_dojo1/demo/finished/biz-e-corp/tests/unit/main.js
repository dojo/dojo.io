define([ 'myapp' ], function (myapp) {
	var bdd = intern.getInterface('bdd');
	var chai = intern.getPlugin('chai');

	var assert = chai.assert;
	var describe = bdd.describe;
	var it = bdd.it;
	var beforeEach = bdd.beforeEach;
	var afterEach = bdd.afterEach;

	var sandbox;

	describe('MyApp', function () {
		beforeEach(function () {
			sandbox = document.createElement('div');
			document.body.appendChild(sandbox);
			myapp.start(sandbox);
		});

		afterEach (function () {
			document.body.removeChild(sandbox);
		});

		it('should render', function () {
			var workerNodes = sandbox.getElementsByTagName('myapp-worker');
			assert.strictEqual(3, workerNodes.length);
		});

		it('should run the widget', function () {
			var workerNodes = sandbox.getElementsByTagName('myapp-worker');
			var nameNodes = workerNodes[0].getElementsByTagName('strong');
			assert.isNotNull(nameNodes);
			assert.strictEqual(1, nameNodes.length);
			assert.strictEqual('Jones, Tim', nameNodes[0].textContent);
		});
	});
});
