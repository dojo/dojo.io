export default [
	{
		path: 'directory',
		outlet: 'directory',
		children: [
			{
				path: '{filter}',
				outlet: 'filter'
			}
		]
	},
	{
		path: 'new-worker',
		outlet: 'new-worker'
	},
	{
		path: '/',
		outlet: 'home',
		defaultRoute: true
	}
];
