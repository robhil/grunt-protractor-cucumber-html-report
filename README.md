# grunt-protractor-cucumber-html-report

> Generate html report from JSON file returned by cucumber js json formatter

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-protractor-cucumber-html-report --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-protractor-cucumber-html-report');
```

## The "protractor-cucumber-html-report" task

### Overview
In your project's Gruntfile, add a section named `protractor-cucumber-html-report` to the data object passed into `grunt.initConfig()`.

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
### Print screen examples
1. Main Page

![mainpage](./printScreens/main.png?raw=true "Main page")
2. Extended scenarios

![mainpage](./printScreens/extendedScenario.png?raw=true "Extended scenario")
3. Report chart with the basic statistics

![mainpage](./printScreens/chart.png?raw=true "Extended scenario")
### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

# Usage Examples

#### Default Options

```js
grunt.initConfig({
  'protractor-cucumber-html-report': {
    options: {
      dest: '.',
      output: 'report.html',
      testJSONResultPath: '',
      testJSONDirectory: '',
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


#### Release history:
###### 0.2.8 Display steps' example table for cucumber > 1.2.x.
###### 0.2.7 Do not show before in the steps.
###### 0.2.6 Displaying scenarios outline table, incorporating sass and some small tweaks.
###### 0.2.5 Adding steps' duration and overall time elapsed for running tests.
###### 0.2.4 Adding css style for passed header when all scenarios have passed.
###### 0.2.3 Adding screenshots in report.
###### 0.2.2 Changes in filtering steps. Small changes in css.
###### 0.2.1 Creating output directory when it doesn't exist.
###### 0.2.0 Generating reports from more than one browser.
###### 0.0.x Creating report and grunt task. Bug fixes for current versions.
