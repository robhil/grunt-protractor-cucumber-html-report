var assert = require('assert');
var fs = require('fs-extra');
var path = require('path');
var es = require('event-stream');
var File = require('vinyl');
var reporter = require('../index');

var outputFolder = path.join(__dirname, '../output');

describe('gulp-protractor-cucumber-html-report', function() {
  describe('in streaming mode', function() {
    before(function () {
      fs.emptyDirSync(outputFolder);
    });

    it('should create a report', function(done) {
      var stream = reporter({
        dest: 'output'
      });

      var jsonFileBuffer = fs.readFileSync(path.join(__dirname, './data/cucumber_report.json'));
      var jsonFile = new File({
        contents: jsonFileBuffer
      });

      var expectedReportBuffer = fs.readFileSync(path.join(__dirname, './data/expected_report.html'));

      stream.on('data', function () {
        var resultBuffer = fs.readFileSync(outputFolder + '/report.html');

        assert.equal(resultBuffer.toString(), expectedReportBuffer.toString());
      });

      stream.on('end', function () {
        done();
      });

      stream.write(jsonFile);
      stream.end();
    });
  });
});