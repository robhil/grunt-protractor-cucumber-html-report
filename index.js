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
    stepTemplate: path.join(currentDir, './templates/step_template.html'),
    screenshotTemplate: path.join(currentDir, './templates/screenshot_template.html')
  };

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
    }

    if (file.isBuffer()) {
      var testResults = JSON.parse(file.contents);

      fs.open(opts.dest + '/' + opts.filename, 'w+', function (err, fd) {
        if (err) {
          fs.mkdirsSync(opts.dest);
          fd = fs.openSync(opts.dest + '/' + opts.filename, 'w+');
        }
        fs.writeSync(fd, formatter.generateReport(testResults, opts.templates));
        fs.copySync(currentDir + '/templates/assets', opts.dest + '/assets/');

        gutil.log(PLUGIN_NAME + ':', 'File \'' + opts.filename + '\' has been created in \'' + opts.dest + '\' directory');

        cb(null, file)
      });

    } else {
      throw new PluginError(PLUGIN_NAME, '[Error] Currently only buffers are supported');
    }
  });
}

// Exporting the plugin main function
module.exports = gulpProtractorCucumberHtmlReport;
