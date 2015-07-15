/**
 * Created by roberthilscher on 25.06.15.
 */


module.exports = (function() {

  var grunt = require('grunt'),
    path = require('path'),
    fs   = require('fs'),
    currentDir = path.dirname(fs.realpathSync(__filename)),
    statuses = {
      FAILED: 'failed',
      PASSED: 'passed',
      UNDEFINED: 'undefined',
      PENDING: 'pending',
      SKIPPED: 'skipped'
    },
    html = '',
    templates;

  /**
   * Convert html tags to html entites
   * @param str
   * @returns {XML|string|*|void}
   */
  function toHtmlEntities (str) {
    str = str || '';
    return str.replace(/./gm, function(s) {
      return "&#" + s.charCodeAt(0) + ";";
    });
  }


  /**
   * Return html code of step element based on step template
   * @param step - object which contains step data
   * @returns string
   */
  function getStep(step) {
    var template = grunt.file.read(templates.stepTemplate),
      stepTemplate;

    stepTemplate = grunt.template.process(template, {
      data:{
        status: step.result ? step.result.status: '',
        errorDetails: step.result ? toHtmlEntities(step.result.error_message): '',
        name: step.keyword + step.name
      }
    });
    return stepTemplate;
  }

  /**
   * Return html code of scenario element based on scenario template
   * @param scenario - object which contains step data
   * @param isPassed = flag which is true when all steps in scenario are passed otherwise is false
   * @returns string
   */
  function getScenario(scenario, isPassed) {
    var template = grunt.file.read(templates.scenarioTemplate),
      scenarioTemplate;

    scenarioTemplate = grunt.template.process(template, {
      data:{
        status: isPassed ? statuses.PASSED : statuses.FAILED,
        name: scenario.keyword + ':' + scenario.name
      }
    });
    return scenarioTemplate;
  }

  /**
   * Return html code of feature element based on feature template
   * @param feature - object which contains feature data
   * @returns {*}
   */
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

  /**
   * Return true when all steps is passed otherwise return false
   * @param scenariosNumber
   * @param passedScenarios
   * @returns {boolean}
   */
  function areTestsPassed(scenariosNumber, passedScenarios) {
    return (scenariosNumber === passedScenarios);
  }

  /**
   * Return header html code  based on header template
   * @param scenariosNumber
   * @param passedScenarios
   * @param stepsNumber
   * @param passedSteps
   * @returns {*}
   */
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

  /**
   * Generate html code which contains all elements needed to generate reports
   * @param testResults
   * @returns {string}
   */
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

      html = '';
      html += getFeature(testResults[i]);

      for (var j = 0; j < testResults[i].elements.length; j++) {
        element = testResults[i].elements[j];
        if (element.type === 'scenario') {
          scenariosNumber++;
          stepsHtml = '';
          isPassed = true;
          for (var k = 0; k < testResults[i].elements[j].steps.length; k++) {
            step = testResults[i].elements[j].steps[k];
            stepsHtml += getStep(step);
            stepsNumber++;
            if (step.result.status !== statuses.PASSED) {
              isPassed = false;
            } else if (step.result.status === statuses.PASSED) {
              passedSteps++;
            }
          }

          if (isPassed) {
            passedScenarios++;
          }
          html += '<div class="scenario-container">' + getScenario(element, isPassed);
          html += stepsHtml + '</div>';
        }
      }
    }
    header = getHeader(scenariosNumber, passedScenarios, stepsNumber, passedSteps);
    return header + html;
  }

  /**
   * Generate report from report template
   * @param html - concatenated all elements
   * @returns string which contains html code of report
   */
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
  };

}());