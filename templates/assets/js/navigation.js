var app = app || {};

app.navigation = (function () {

        return {
            init: function () {
                var errors = document.querySelectorAll('.error-container'),
                    screenshots = document.querySelectorAll('.screenshot-container'),
                    filteringButtons = document.getElementsByClassName('btn'),
                    scenarios = document.querySelectorAll('.scenario-container'),
                    steps = document.querySelectorAll('.step'),
                    displayChartButton = document.querySelector('.btn_chart');
                this.bindEvents(errors, scenarios, screenshots, filteringButtons, displayChartButton);
                this.bindFilterButtonsEvent(filteringButtons, scenarios, steps);
            },
            currentView: 'all',
            /** Showing error log  for step that failed */
            showPrintScreen: function (e) {
                e.stopPropagation();
                var display = this.querySelector('.img-screenshot').style.display,
                    printScreen = this.querySelector('.ps-error-arrow'),
                    commandLoc = this.querySelector('.label'),
                    showPrintScreen = 'Show print screen',
                    hidePrintScreen = 'Hide print screen';
                if (display === 'block') {
                    printScreen.classList.remove('fa-angle-up');
                    printScreen.classList.add('fa-angle-down');
                    app.navigation.writeNewText(commandLoc, showPrintScreen);
                    this.querySelector('.img-screenshot').style.display = 'none';
                } else {
                    this.querySelector('.img-screenshot').style.display = 'block';
                    printScreen.classList.remove('fa-angle-down');
                    printScreen.classList.add('fa-angle-up');
                    app.navigation.writeNewText(commandLoc, hidePrintScreen);
                }
            },
            writeNewText: function (loc, newText) {
                loc.innerHTML = newText;
            },
            showErrorDetails: function (e) {
                e.stopPropagation();
                var display = this.querySelector('.error-message').style.display,
                    errorArrow = this.querySelector('.error-arrow'),
                    commandLoc = this.querySelector('.error-code-label'),
                    showErrorCode = 'Show error code',
                    hideErrorCode = 'Hide error code';
                if (display === 'block') {
                    errorArrow.classList.remove('fa-angle-up');
                    errorArrow.classList.add('fa-angle-down');
                    app.navigation.writeNewText(commandLoc, showErrorCode);
                    this.querySelector('.error-message').style.display = 'none';
                } else {
                    errorArrow.classList.remove('fa-angle-down');
                    errorArrow.classList.add('fa-angle-up');
                    app.navigation.writeNewText(commandLoc, hideErrorCode);
                    this.querySelector('.error-message').style.display = 'block';
                }
            },
            /** Hiding and displaying steps after clicking on scenario header*/
            toggleStep: function () {
                var steps = this.querySelectorAll('.step');
                var scenarioArrow = this.querySelector('.scenario-arrow');

                for (var k = 0; k < steps.length; k++) {
                    if (steps[k].style.display === 'block') {
                        scenarioArrow.classList.remove('fa-angle-up');
                        scenarioArrow.classList.add('fa-angle-down');
                        steps[k].style.display = 'none';
                    } else {
                        steps[k].style.display = 'block';
                        scenarioArrow.classList.remove('fa-angle-down');
                        scenarioArrow.classList.add('fa-angle-up');
                    }
                }
            },

            bindEvents: function (errors, scenarios, screenshots, filteringButtons, displayChartButton) {
                var i = 0,
                    self = this;
                //var printScreen = '.img-screenshot';
                for (i = 0; i < errors.length; i++) {
                    errors[i].addEventListener('click', this.showErrorDetails, false);
                }
                for (i = 0; i < scenarios.length; i++) {
                    scenarios[i].addEventListener('click', this.toggleStep, false);
                }
                for (i = 0; i < screenshots.length; i++) {
                    screenshots[i].addEventListener('click', this.showPrintScreen, false);
                    //screenshots[i].addEventListener('click', this.showPrintScreen(printScreen), false);
                }
            },
            /**
             * Filtering passed and failed scenarios by clicking the passed or failed button respectively
             *
             * @param buttonState indicates the clicked button
             */
            filterScenarios: function (buttonState) {
                var scenarios = document.querySelectorAll('.scenario'),
                    hasClass,
                    self = this;
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
                    self.currentView = 'failed';
                    this.hideFeatureContainer('passed');
                } else {
                    self.currentView = 'passed';
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
                var self = this;
                self.currentView = 'all';
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
                                if (self.currentView === 'failed') {
                                    self.toggleStepsVisibilities('.scenario.failed .step', 'passed');
                                }
                                else if (self.currentView === 'passed') {
                                    self.toggleStepsVisibilities('.scenario.passed .step', 'failed');
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
             * @param stepsLocator locates steps in scenarios
             * @param status indicates scenarios which should be hidden
             */
            toggleStepsVisibilities: function (stepsLocator, status) {
                var self = this,
                    stepsCollection = document.querySelectorAll(stepsLocator),
                    i,
                    scenarioArrowCollection = document.querySelectorAll('.scenario-arrow');
                for (i = 0; i < stepsCollection.length; i++) {
                    if (stepsCollection[i].style.display === 'none') {
                        this.addArrowUp(scenarioArrowCollection);
                        stepsCollection[i].style.display = 'block';
                    } else {
                        this.addArrowDown(scenarioArrowCollection);
                        stepsCollection[i].style.display = 'none';
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
                var scenarioArrowCollection = document.querySelectorAll('.scenario-arrow');
                for (var i = 0; i < steps.length; i++) {
                    var display = steps[i].style.display;
                    if (display === 'none' || display === '') {
                        this.addArrowUp(scenarioArrowCollection);
                        steps[i].style.display = 'block';
                        all_btn.classList.add('active');
                    } else {
                        this.addArrowDown(scenarioArrowCollection);
                        all_btn.classList.add('active');
                        steps[i].style.display = 'none';
                    }
                }
            },
            addArrowUp: function (collection) {
                for (var i = 0; i < collection.length; i++) {
                    collection[i].classList.remove('fa-angle-down');
                    collection[i].classList.add('fa-angle-up');
                }
            },
            addArrowDown: function (collection) {
                for (var i = 0; i < collection.length; i++) {
                    collection[i].classList.remove('fa-angle-up');
                    collection[i].classList.add('fa-angle-down');
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
