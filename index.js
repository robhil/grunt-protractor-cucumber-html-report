var through = require('through2'),
gutil = require('gulp-util'),
formatter = require('./lib/html_formatter'),
path = require('path'),
fs = require('fs-extra'),
PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-protractor-cucumber-html-reporter';

function gulpProtractorCucumberHtmlReport(opts) {
  var currentDir = __dirname;

  opts = opts || {};
  if (!opts.dest) {
    opts.dest = '.';
  }
  if (!opts.filename) {
    opts.filename = 'report.html';
  }
  opts.templates = {
    featureTemplate: path.join(currentDir, './templates/feature_template.html'),
    headerTemplate: path.join(currentDir, './templates/header_template.html'),
    reportTemplate: path.join(currentDir, './templates/report_template.html'),
    scenarioTemplate: path.join(currentDir, './templates/scenario_template.html'),
    stepTemplate: path.join(currentDir, './templates/step_template.html')
  };

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isBuffer()) {
      var testResults = JSON.parse(file.contents);

      fs.writeFileSync(opts.dest + '/' + opts.filename, formatter.generateReport(testResults, opts.templates));

      fs.copySync(currentDir + '/templates/assets', opts.dest + '/assets/');

      gutil.log('File ' + opts.filename + ' has been created in \'' + opts.dest + '\' directory');
    } else {
      throw new PluginError(PLUGIN_NAME, '[Error] Currently only buffers are supported');
    }

    return cb(null, file);
  });
}

// Exporting the plugin main function
module.exports = gulpProtractorCucumberHtmlReport;