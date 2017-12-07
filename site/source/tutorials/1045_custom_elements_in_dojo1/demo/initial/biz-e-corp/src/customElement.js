define([], function () {
	// A Dojo plugin to load custom element definitions.
	//   'customElement!path/to/custom/element/html/file.html'
	var headNode;

	function getHeadNode() {
		if (!headNode) {
			var nodes = document.getElementsByTagName('head');
			if (nodes && nodes.length) {
				headNode = nodes[0];
			}
		}

		if (!headNode) {
			throw new Error('Could not find a <head> element.');
		}
		return headNode;
	}

	return {
		load: function(id, require, load){
			var linkNode = document.createElement('link');
			linkNode.rel = 'import';
			linkNode.href = require.toUrl(id);
			getHeadNode().appendChild(linkNode);

			load(id);
		}
	};
});
