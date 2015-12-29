var app = app || {};

app.navigation = (function () {

        return {
            init: function () {
                var errors = document.querySelectorAll('.step.failed'),
                    filteringButtons = document.getElementsByClassName('btn'),
                    scenarios = document.querySelectorAll('.scenario-container'),
                    steps = document.querySelectorAll('.step'),
                    displayChartButton = document.querySelector('.btn_chart');

                this.bindEvents(errors, scenarios, filteringButtons, displayChartButton);
                this.bindFilterButtonsEvent(filteringButtons, scenarios, steps);
            },
            /** Showing error log  for step that failed */
            showErrorDetails: function (e) {
                e.stopPropagation();
                var display = this.querySelector('.error-details').style.display;

                if (display === 'block') {
                    this.querySelector('.error-details').style.display = 'none';
                } else {
                    this.querySelector('.error-details').style.display = 'block';
                }
            },
            /** Hiding and displaying steps after clicking on scenario header*/
            toggleStep: function () {
                var steps = this.querySelectorAll('.step');
                for (var k = 0; k < steps.length; k++) {
                    if (steps[k].style.display === 'block') {
                        steps[k].style.display = 'none';
                    } else {
                        steps[k].style.display = 'block';
                    }
                }
            },

            bindEvents: function (errors, scenarios, filteringButtons, displayChartButton) {
                var i = 0,
                    self = this;

                for (i = 0; i < errors.length; i++) {
                    errors[i].addEventListener('click', this.showErrorDetails, false);
                }

                for (i = 0; i < scenarios.length; i++) {
                    scenarios[i].addEventListener('click', this.toggleStep, false);
                }
            },
            /**
             * Filtering passed and failed scenarios by clicking the passed or failed button respectively
             *
             * @param buttonState indicates the clicked button
             */
            filterScenarios: function (buttonState) {
                var scenarios = document.querySelectorAll('.scenario'),
                    hasClass;
                for (var i = 0; i < scenarios.length; i++) {
                    hasClass = scenarios[i].classList.contains(buttonState);
                    if (hasClass === true) {
                        if (scenarios[i].parentNode.style.display === 'none') {
                            scenarios[i].parentNode.style.display = 'block';
                        }
                    } else {
                        scenarios[i].parentNode.style.display = 'none';
                    }
                }

                if (buttonState === 'failed') {
                    this.hideFeatureContainer('passed');
                } else {
                    this.hideFeatureContainer('failed');
                }


            },
            /**
             * Displaying all scenarios within the report
             *
             * @param scenarios indicate the all scenarios in report
             *
             */
            displayAllScenarios: function (scenarios) {
                for (var i = 0; i < scenarios.length; i++) {
                    if (scenarios[i].style.display != 'block') {
                        scenarios[i].style.display = 'block';
                    }
                }
            },
            /**
             * @param string buttonsList indicate the group of buttons that have the "active" class name
             *
             * Removing "active" class from all buttons except for the active one
             */
            removeActiveClass: function (buttonsList) {
                for (var j = 0; j < buttonsList.length; j++) {
                    buttonsList[j].classList.remove('active');
                }
            },
            /**
             * Run appropriate action depending on button state
             *
             * @param filteringButtons indicate the navigation buttons
             *
             * @param scenarios indicate all scenarios in report
             *
             * @param steps indicate all steps in report
             */
            bindFilterButtonsEvent: function (filteringButtons, scenarios, steps) {
                var self = this,
                    btnState;
                for (var k = 0; k < filteringButtons.length; k++) {
                    filteringButtons[k].addEventListener('click', function () {

                        btnState = this.dataset.state;
                        self.displayAllFeatures();

                        if (btnState !== 'steps') {
                            self.removeActiveClass(filteringButtons);
                            this.classList.add('active');
                            self.hideSteps(steps);
                        }

                        switch (btnState) {

                            case 'all':
                                self.displayAllScenarios(scenarios);
                                break;
                            case 'chart':
                                app.chart.toggleChart();
                                self.displayAllScenarios(scenarios);
                                break;
                            case 'steps':
                                if (document.querySelector('.error_btn').classList.contains('active')) {
                                    self.toggleStepsVisibilities('.scenario.failed', 'passed');
                                }
                                else if (document.querySelector('.passed_btn').classList.contains('active')) {
                                    self.toggleStepsVisibilities('.scenario.passed', 'failed');
                                } else {
                                    self.displayAllScenarios(scenarios);
                                    self.toggleSteps(steps);
                                }
                                break;
                            default:
                                self.filterScenarios(btnState);
                                break;
                        }
                    }, false);
                }
            },
            /**
             * If I filtered out passed/failed scenarios I want to expand only filtered steps not all of them.
             * @param scenariosStatus
             * @param status
             */
            toggleStepsVisibilities: function (scenariosStatus, status) {
                var self = this,
                    parents = document.querySelectorAll(scenariosStatus),
                    parentsCollection = [],
                    stepsCollection = [],
                    i,
                    k;
                for (i = 0; i < parents.length; i++) {
                    parentsCollection.push(parents[i].parentNode);
                }

                for (i = 0; i < parentsCollection.length; i++) {
                    stepsCollection.push(parentsCollection[i].querySelectorAll('.step'))
                }

                for (i = 0; i < stepsCollection.length; i++) {
                    for (k = 0; k < stepsCollection[i].length; k++) {
                        if (stepsCollection[i][k].style.display === 'none') {
                            stepsCollection[i][k].style.display = 'block';
                        } else {
                            stepsCollection[i][k].style.display = 'none';
                        }
                    }
                }
                self.hideFeatureContainer(status);
            },

            /**
             * Displaying and hiding steps by clicking "chart report" button
             *
             * @param steps indicate all steps in report
             */
            toggleSteps: function (steps) {
                for (var i = 0; i < steps.length; i++) {
                    var display = steps[i].style.display;
                    if (display === 'none' || display === '') {
                        steps[i].style.display = 'block';
                        all_btn.classList.add('active');
                    } else {
                        all_btn.classList.add('active');
                        steps[i].style.display = 'none';
                    }
                }
            },
            /**
             * Hiding currently displayed steps
             *
             * @param steps indicate all steps in report
             */
            hideSteps: function (steps) {
                for (var i = 0; i < steps.length; i++) {
                    steps[i].style.display = 'none';
                }
            },
            /**
             * Display all hidden features. If the feature contains scenarios with different status the passed/error button
             * hides failed or passed scenarios respectively.
             */
            displayAllFeatures: function () {
                var features = document.querySelectorAll('.feature-with-scenarios');
                for (var i = 0; i < features.length; i++) {
                    features[i].classList.remove('hidden');
                }
            },
            /**
             * Hide features and scenarios which are not corresponding to the triggered button state.
             * eg. passed button hides all failed scenarios and features if the feature
             * contains only failed scenarios. If there is at least one passed scenario within the feature, the feature description is displayed.
             * @param state indicates the button state which corresponds with scenario status
             */
            hideFeatureContainer: function (state) {
                var features = document.querySelectorAll('.feature-with-scenarios'),
                    scenarios,
                    counter = 0;

                for (var i = 0; i < features.length; i++) {
                    scenarios = features[i].querySelectorAll('.scenario');
                    counter = 0;
                    for (var j = 0; j < scenarios.length; j++) {
                        if (scenarios[j].classList.contains(state)) {
                            counter++;
                        }
                    }
                    if (counter === scenarios.length) {
                        features[i].classList.add('hidden');
                    }
                }
            }
        }
    }()
)
;
