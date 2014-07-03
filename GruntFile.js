module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		buster: {
			test: {}
		},

		'browserify': {
			test: {
				src: 'test/helpers.js',
				dest: 'coverage/build/test.js'
			},
			options: {
				standalone: '<%= pkg.name %>',
			}
		},

		instrument: {
			files: ['media.js'],
			options: {
				basePath: 'coverage/'
			}
		},

		copy: {
			target: {
				expand: true,
				src: ['media.js'],
				dest: 'coverage/'
			}
		}
	});

	grunt.loadNpmTasks('grunt-buster');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-istanbul');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task.
	grunt.registerTask('test', ['instrument', 'browserify:test', 'buster:test']);
	grunt.registerTask('debug', ['copy', 'browserify:test', 'buster:test']);
};
