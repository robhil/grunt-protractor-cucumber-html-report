/**
 * Created by roberthilscher on 25.06.15.
 */


module.exports = (function() {

    var grunt = require('grunt'),
        path = require('path'),
        fs = require('fs'),
        currentDir = path.dirname(fs.realpathSync(__filename)),
        statuses = {
            FAILED: 'failed',
            PASSED: 'passed',
            UNDEFINED: 'undefined',
            PENDING: 'pending',
            SKIPPED: 'skipped'
        },
        html = '',
        reportTitle,
        templates;

    /**
     * Convert html tags to html entites
     * @param str
     * @returns {XML|string|*|void}
     */
    function toHtmlEntities(str) {
        str = str || '';
        return str.replace(/./gm, function(s) {
            return "&#" + s.charCodeAt(0) + ";";
        });
    }

    /**
     * Checks if the step is an empty Before step
     * @param step - object which contains step data
     * @returns boolean
     */
    function isEmptyBeforeStep(step) {
        return step.keyword.trim() === 'Before' && step.name === undefined && step.embeddings === undefined;
    }

    /**
     * Checks if the step is an empty After step
     * @param step - object which contains step data
     * @returns boolean
     */
    function isEmptyAfterStep(step) {
        return step.keyword.trim() === 'After' && step.name === undefined && step.embeddings === undefined;
    }

    /**
     * Checks if the step is an After step containing a screenshot
     * @param step - object which contains step data
     * @returns boolean
     */
    function isAfterStepWithScreenshot(step) {
        return step.keyword.trim() === 'After' && step.embeddings && step.embeddings[0] && step.embeddings[0].mime_type === 'image/png';
    }

    /**
     * Return html code of step element based on step template
     * @param step - object which contains step data
     * @returns string
     */
    function getAfterScreenshotStep(step) {
        var template = grunt.file.read(templates.screenshotTemplate),
            stepTemplate;
        stepTemplate = grunt.template.process(template, {
            data: {
                screenshot: step.embeddings && step.embeddings[0] ? step.embeddings[0].data : ''
            }
        });
        return stepTemplate;
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
            data: {
                status: step.result ? step.result.status : '',
                errorDetails: step.result ? toHtmlEntities(step.result.error_message) : '',
                duration: step.result.duration ? calculateDuration(step.result.duration) : 'no data',
                tableOutline: (step.arguments && step.arguments.length > 0) ? step.arguments[0].rows : step.rows,
                name: step.keyword + (step.name ? step.name : '')
            }
        });
        return stepTemplate;
    }
    /**
     * Return html code with all scenarios
     * @param scenarios
     * @returns {*}
     */
    function getScenarioContainer(scenarios) {
        var template = grunt.file.read(templates.scenarioContainerTemplate),
            scenarioContainer;
        scenarioContainer = grunt.template.process(template, {
            data: {
                scenarios: scenarios
            }
        });
        return scenarioContainer;
    }

    function getFeatureWithScenarios(featureWithScenarios) {
        var template = grunt.file.read(templates.featureContainerTemplate),
            featureContainer;
        featureContainer = grunt.template.process(template, {
            data: {
                featureWithScenarios: featureWithScenarios
            }
        });
        return featureContainer;
    }

    /**
     * Return html code of scenario element based on scenario template
     * @param scenario - object which contains step data
     * @param isPassed = flag which is true when all steps in scenario are passed otherwise is false
     * @returns string
     */
    function getScenario(scenario, isPassed, steps) {
        var template = grunt.file.read(templates.scenarioTemplate),
            scenarioTemplate;

        scenarioTemplate = grunt.template.process(template, {
            data: {
                status: isPassed ? statuses.PASSED : statuses.FAILED,
                name: scenario.keyword + ': ' + scenario.name,
                steps: steps
            }
        });
        return scenarioTemplate;
    }

    /**
     * Return html code of feature element based on feature template
     * @param feature - object which contains feature data
     * @returns {*}
     */
    function getFeature(feature, scenariosNumberInFeature, passedScenariosNumberInFeature, stepsNumberInFeature, passedStepsInFeature) {

        var template = grunt.file.read(templates.featureTemplate),
            featureTemplate;

        featureTemplate = grunt.template.process(template, {
            data: {
                name: feature.name,
                scenariosNumberInFeature: scenariosNumberInFeature,
                passedScenariosNumberInFeature: passedScenariosNumberInFeature,
                stepsNumberInFeature: stepsNumberInFeature,
                passedStepsInFeature: passedStepsInFeature
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
    function getHeader(scenariosNumber, passedScenarios, stepsNumber, passedSteps, elapsedTime) {
        var template = grunt.file.read(templates.headerTemplate),
            header = grunt.template.process(template, {
                data: {
                    status: areTestsPassed(scenariosNumber, passedScenarios) ? 'passed' : 'failed',
                    scenariosSummary: scenariosNumber + ' scenarios ' + '(' + passedScenarios + ' passed)',
                    stepsSummary: stepsNumber + ' steps ' + '(' + passedSteps + ' passed)',
                    reportDate: getCurrentDate(),
                    reportTitle: reportTitle,
                    elapsedTime: elapsedTime
                }
            });
        return header;
    }

    function getCurrentDate() {
        function leadingZero(i) {
            return (i < 10) ? '0' + i : i;
        }

        var monthMapping = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            curDate = new Date(),
            year = curDate.getFullYear(),
            month = curDate.getMonth(),
            dayNo = leadingZero(curDate.getDate()),
            hour = leadingZero(curDate.getHours()),
            min = leadingZero(curDate.getMinutes());

        return dayNo + ", " + monthMapping[month] + " " + year + " " + hour + ":" + min;
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
            scenariosNumberInFeature = 0,
            passedScenariosNumberInFeature = 0,
            stepsNumberInFeature = 0,
            passedStepsInFeature = 0,
            scenariosHtml = '',
            element,
            step,
            stepDuration = 0;

        html = '';
        for (var i = 0; i < testResults.length; i++) {

            scenariosNumberInFeature = 0;
            passedScenariosNumberInFeature = 0;
            stepsNumberInFeature = 0;
            passedStepsInFeature = 0;
            scenariosHtml = '';
            if (testResults[i].elements) {
                for (var j = 0; j < testResults[i].elements.length; j++) {
                    element = testResults[i].elements[j];
                    if (element.type === 'scenario') {
                        scenariosNumber++;
                        scenariosNumberInFeature++;
                        stepsHtml = '';
                        isPassed = true;
                        for (var k = 0; k < testResults[i].elements[j].steps.length; k++) {
                            step = testResults[i].elements[j].steps[k];

                            if (isEmptyAfterStep(step) || isEmptyBeforeStep(step)) {
                                continue;
                            }

                            if (isAfterStepWithScreenshot(step)) {
                                stepsHtml += getAfterScreenshotStep(step);
                            } else {
                                stepsHtml += getStep(step);
                                stepDuration += (step.result.duration ? step.result.duration : 0);
                                stepsNumber++;
                                stepsNumberInFeature++;
                                if (step.result.status !== statuses.PASSED) {
                                    isPassed = false;
                                } else if (step.result.status === statuses.PASSED) {
                                    passedSteps++;
                                    passedStepsInFeature++;
                                }
                            }
                        }

                        if (isPassed) {
                            passedScenarios++;
                            passedScenariosNumberInFeature++;
                        }
                        scenariosHtml += getScenarioContainer(getScenario(element, isPassed, stepsHtml));
                    }
                }
            }
            html += getFeatureWithScenarios(getFeature(testResults[i], scenariosNumberInFeature, passedScenariosNumberInFeature, stepsNumberInFeature, passedStepsInFeature) + scenariosHtml);
        }
        header = getHeader(scenariosNumber, passedScenarios, stepsNumber, passedSteps, calculateDuration(stepDuration));
        return header + html;
    }

    function calculateDuration(duration) {
        var elapsedTime = duration / 1000000000;
        if (elapsedTime >= 60) {
            return parseInt(elapsedTime / 60) + 'm ' + (elapsedTime % 60).toFixed(0) + 's';
        } else {
            return elapsedTime.toFixed(2) + 's';
        }
    }

    /**
     * Generate report from report template
     * @param html - concatenated all elements
     * @returns string which contains html code of report
     */
    function generateReport(html) {
        var template = grunt.file.read(templates.reportTemplate);
        return grunt.template.process(template, {
            data: {
                scenarios: html
            }
        });
    }

    return {
        generateReport: function(testResults, options) {
            var html;
            templates = options.templates;
            reportTitle = options.reportTitle;
            html = generateHTML(testResults);
            return generateReport(html);
        }
    };

}());
