# gulp-protractor-cucumber-html-report

> Generate html report from JSON file returned by cucumber js json formatter
> 

## Getting Started
This plugin requires Grunt `~3.9.0`

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
In your project's Gulpfile, add a section named `protractor-cucumber-html-report` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  protractor_cucumber_html_report: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific options go here.
    },
  },
});
```

### Options

#### dest
Type: `String`
Default value: `'.'`

The output directory for the HTML report relative from the Gulpfile

#### filename
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