module.exports = {
	"env": {
		"browser": true,
		"es6": true,
		"jquery": true,
		"mocha": true,
		"mongo": true,
		"node": true
	},
	"extends": [
	],
	"parserOptions": {
		"sourceType": "module"
	},
	"rules": {
		"indent": [
			"error",
			"tab",
			{ "SwitchCase": 1 }
		],
		/*"linebreak-style": [
			"error",
			"windows"
		],*/
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		]
	}
};