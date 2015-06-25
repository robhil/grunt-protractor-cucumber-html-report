/**
 * Created by roberthilscher on 25.06.15.
 */


module.exports = (function(grunt) {

  var grunt = require('grunt'),
    path = require('path'),
    fs   = require('fs'),
    currentDir = path.dirname(fs.realpathSync(__filename)),
    html = '',
    templates;
  function toHtmlEntities (str) {
    str = str || '';
    return str.replace(/./gm, function(s) {
      return "&#" + s.charCodeAt(0) + ";";
    });
  }

  function getStep(step) {
    var template = grunt.file.read(templates.stepTemplate),
      stepTemplate;

    stepTemplate = grunt.template.process(template, {
      data:{
        status: step.result.status,
        errorDetails: toHtmlEntities(step.result.error_message),
        name: step.keyword + step.name
      }
    });
    return stepTemplate;
  }

  function getScenario(scenario, isPassed) {
    var template = grunt.file.read(templates.scenarioTemplate),
      scenarioTemplate;

    scenarioTemplate = grunt.template.process(template, {
      data:{
        status: isPassed ? 'passed' : 'failed',
        name: scenario.keyword + ':' + scenario.name
      }
    });
    return scenarioTemplate;
  }

  function getFeature(feature) {

    var template = grunt.file.read(templates.featureTemplate),
      featureTemplate;

    featureTemplate = grunt.template.process(template, {
      data:{
        name: feature.keyword + ": " +feature.name,
        description: feature.description
      }
    });
    return featureTemplate;
  }

  function areTestsPassed(scenariosNumber, passedScenarios) {
    return (scenariosNumber === passedScenarios)
  }

  function getHeader(scenariosNumber, passedScenarios, stepsNumber, passedSteps) {
    var template = grunt.file.read(templates.headerTemplate),
      header  = grunt.template.process(template, {
        data:{
          status: areTestsPassed(scenariosNumber, passedScenarios) ? 'passed' : 'failed',
          scenariosSummary: scenariosNumber + ' scenarios ' + '( ' + passedScenarios + ' passed)',
          stepsSummary: stepsNumber + ' steps ' + '( ' + passedSteps + ' passed)'
        }
      });
    return header;
  }

  function generateHTML(testResults) {
    var stepsHtml = '',
      header = '',
      isPassed = false,
      passedScenarios = 0,
      passedSteps = 0,
      stepsNumber = 0,
      scenariosNumber = 0,
      element,
      step;

    for (var i = 0; i < testResults.length; i++) {
      isPassed = true;
      html = '';

      html += getFeature(testResults[i]);

      for (var j = 0; j < testResults[i].elements.length; j++) {
        element = testResults[i].elements[j];

        if (element.type === 'scenario') {
          scenariosNumber++;
          stepsHtml = '';

          for (var k = 0; k < testResults[i].elements[j].steps.length; k++) {
            step = testResults[i].elements[j].steps[k];
            stepsHtml += getStep(step);
            stepsNumber++;
            if (step.result.status !== 'passed') {
              isPassed = false;
            } else if (step.result.status === 'passed') {
              passedSteps++;
            }
          }
        }

        if (isPassed) {
          passedScenarios++;
        }

        if (element.type === 'scenario') {
          html += getScenario(element, isPassed);
        }
        html += stepsHtml;
      }
    }
    header = getHeader(scenariosNumber, passedScenarios, stepsNumber, passedSteps);
    return header + html;
  }

  function generateReport(html) {
    var template = grunt.file.read(templates.reportTemplate);
    return grunt.template.process(template, {
      data:{
        scenarios: html
      }
    });
  }

  return {
    generateReport: function (testResults, htmlTemplates) {
      var html;

      templates = htmlTemplates;
      html = generateHTML(testResults);
      return generateReport(html);
    }
  }

}());