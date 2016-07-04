module.exports = {
	source: './src',
	destination: './esdoc',
	excludes: [
		'__tests__'
	],
	plugins: [
		{
			name: 'esdoc-es7-plugin'
		}
	]
};