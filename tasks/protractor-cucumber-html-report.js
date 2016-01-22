/*
 * grunt-protractor-cucumber-html-report
 * https://github.com/roberthilscher/grunt-protractor-cucumber-html-report
 *
 * Copyright (c) 2015 Hilscher, Robert
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function(grunt) {

  var formatter = require('../lib/html_formatter'),
      path = require('path'),
      fs   = require('fs');

  grunt.registerMultiTask('protractor-cucumber-html-report', 'Generate html report from JSON file returned by cucumber js json formatter', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var currentDir = path.dirname(fs.realpathSync(__filename)),
      options = this.options({
      dest: '.',
      output: 'report.html',
      testJSONResultPath: '',
      testJSONDirectory: '',
      reportTitle: "Test report",
      templates: {
        featureTemplate: currentDir + '/../templates/feature_template.html',
        headerTemplate: currentDir + '/../templates/header_template.html',
        reportTemplate: currentDir + '/../templates/report_template.html',
        scenarioTemplate: currentDir + '/../templates/scenario_template.html',
        stepTemplate: currentDir + '/../templates/step_template.html',
        scenarioContainerTemplate: currentDir + '/../templates/scenario-container_template.html',
        featureContainerTemplate: currentDir + '/../templates/feature-container_template.html',
        screenshotTemplate: currentDir + '/../templates/screenshot_template.html'
      }
    }),
      EXAMPLE_TEST_RESULT_PATH = currentDir + '/../assets/example_test_result.json',
      jsonPath = options.testJSONResultPath || EXAMPLE_TEST_RESULT_PATH,
      testResults,
      jsonDirectory = options.testJSONDirectory;

    function generateReport (jsonPath, directoryName) {
      testResults = grunt.file.readJSON(jsonPath);
      grunt.file.write(options.dest + (directoryName ? '/' + directoryName + '/' : '/') + options.output, formatter.generateReport(testResults, options));
      grunt.file.recurse(currentDir + '/../templates/assets', function (abspath, rootdir, subdir, filename) {
        grunt.file.copy(abspath, options.dest + '/' + (directoryName ? '/' + directoryName + '' : '') + '/assets/' + subdir + '/' + filename);
      });
    }

    if (jsonDirectory) {
      if (!grunt.file.isDir(jsonDirectory)) {
        grunt.file.mkdir(jsonDirectory);
      }
      grunt.file.recurse(jsonDirectory, function (abspath, rootdir, subdir, filename) {
        var pattern = /^.*\.(json)$/,
            directoryName = filename.replace('.json', '');
        if (pattern.test(filename)) {
          generateReport(abspath, directoryName);
        }
      });
      return true;
    }

    if (!options.testJSONResultPath) {
      grunt.log.writeln('[Warning] Your testJSONResultPath option is empty. Task will use example JSON');
    }

    if (grunt.file.exists(jsonPath)) {
      testResults = grunt.file.readJSON(jsonPath);
      generateReport(jsonPath);
      grunt.log.writeln('File ' + options.output + ' has been created in \'' + options.dest + '\' directory');
    } else {
      grunt.log.error('File ' + jsonPath + ' doesn\'t exist');
      return false;
    }

  });
};
