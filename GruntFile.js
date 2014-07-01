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
        standalone: '<%= pkg.name %>'
      }
    },

    uglify: {
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    watch: {
      scripts: {
        files: ['media.js'],
        tasks: ['browserify']
      }
    },

    instrument: {
      files: 'media.js',
      options: {
        basePath: 'coverage/'
      }
    },
  });

  grunt.loadNpmTasks('grunt-buster');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-istanbul');

  // Default task.
  grunt.registerTask('test', ['instrument', 'browserify:test', 'buster:test']);
};
