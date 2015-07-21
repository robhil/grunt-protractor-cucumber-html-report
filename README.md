# gulp-protractor-cucumber-html-report

> Generate html report from JSON file returned by CucumberJS json formatter

This is a stand-alone fork of [grunt-protractor-cucumber-html-report](https://github.com/robhil/grunt-protractor-cucumber-html-report)

## Getting Started
This plugin requires Gulp `~3.9.0`

If you haven't used [Gulp](http://gulpjs.com/) before, be sure to check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) guide, as it explains how to create a Gulpfile as well as install and use Gulp plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install gulp-protractor-cucumber-html-report --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gulpfile with this line of JavaScript:

```js
var reporter = require('gulp-protractor-cucumber-html-report');
```

## The "protractor-cucumber-html-report" task

### Overview
In your project's Gulpfile, you can use the reporter in your pipeline as follows:

```js
gulp.src('./cucumber-test-results.json')
    .pipe(protractorReport({
        dest: 'reports/'
    }));
```

### Saving CucumberJS json to disk when using Protractor
If you're using Protractor in combination with CucumberJS there currently is [no way](https://github.com/cucumber/cucumber-js/issues/90) to save the CucumberJS JSON output to a file. 
 
It is however possible to add a listener to the CucumberJS JSON formatter and save it to a file manually. The following hook can be added to your project and included to your Protractor configuration.

```js
module.exports = function JsonOutputHook() {
  var Cucumber = require('cucumber');
  var JsonFormatter = Cucumber.Listener.JsonFormatter();
  var fs = require('fs');
  var path = require('path');

  JsonFormatter.log = function (json) {
    fs.writeFile(path.join(__dirname, './reports/cucumber-test-results.json'), json, function (err) {
      if (err) throw err;
      console.log('json file location: ' + path.join(__dirname, './reports/cucumber-test-results.json'));
    });
  };

  this.registerListener(JsonFormatter);
};
```

Above snippet will hook into the CucumberJS JSON formatter and save the JSON to a file called 'cucumber-test-results.json' in the './reports' folder (relative from this file's location)

### Setting up Protractor, CucumberJS and the JSON listener

In your protractor.conf.js add a reference to the hook listener (as shown above). In this example the file is found in './support'. Also make sure to set the output format to 'json'.

```js
cucumberOpts: {
  require: ['steps/*.js', 'support/*.js'],
  format: 'json'
},
```
### Options

#### options.dest
Type: `String`
Default value: `'.'`

The output directory for the HTML report relative from the Gulpfile

#### options.filename
Type: `String`
Default value: `'report.html'`

The filename for the HTML report

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  'protractor-cucumber-html-report': {
    options: {
      dest: '.',
      output: 'report.html',
      testJSONResultPath: '',
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Copyright
 
Copyright for portions of project [gulp-protractor-cucumber-html-report](https://github.com/mrooding/gulp-protractor-cucumber-html-report) are held by Robert Hilscher, 2015 as part of project [grunt-protractor-cucumber-html-report](https://github.com/robhil/grunt-protractor-cucumber-html-report). All other copyright for project [gulp-protractor-cucumber-html-report](https://github.com/mrooding/gulp-protractor-cucumber-html-report) are held by Marc Rooding, 2015.

## Release History
_(Nothing yet)_