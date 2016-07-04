/*
 * grunt-protractor-cucumber-html-report
 * https://github.com/roberthilscher/grunt-protractor-cucumber-html-report
 *
 * Copyright (c) 2015 Hilscher, Robert
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'lib/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporterOutput: "",
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    'protractor-cucumber-html-report': {
      default_options: {
        options: {
          dest: 'tmp',
          output: 'report.html',
          testJSONDirectory: 'assets',
          reportTitle: "Test report generated via automatic tests"
        }
      }
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'templates/assets/css/style.css': '_sass/style.scss'
        }
      }
    },
    watch: {
      css: {
        files: '_sass/*.scss',
        tasks: ['sass']
      }
    },
    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'sass','protractor-cucumber-html-report', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'clean', 'sass','protractor-cucumber-html-report']);

};
