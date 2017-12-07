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
	});
});
