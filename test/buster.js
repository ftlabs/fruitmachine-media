var config = module.exports;

config["fruitmachine-media"] = {
	rootPath: '../',
	environment: "browser",
	sources: [
		'node_modules/fruitmachine/build/fruitmachine.js',
		'node_modules/es6-promise/dist/es6-promise.js',
		'node_modules/hogan.js/lib/template.js',
		'node_modules/hogan.js/lib/compiler.js',
		'coverage/build/test.js'
	],
	tests: [
		'test/tests/*.js'
	],
	extensions: [
		require('buster-istanbul')
	],
	"buster-istanbul": {
		instrument: false,
		outputDirectory: "coverage",
		format: "lcov"
	}
};
