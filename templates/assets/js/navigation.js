var app = app || {};

app.navigation  = (function () {

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

          if (btnState !== 'steps') {
            self.removeActiveClass(filteringButtons);
            this.classList.add('active');
            self.hideSteps(steps);
          }

          switch(btnState) {

            case 'all':
              self.displayAllScenarios(scenarios);
              break;
            case 'chart':
              app.chart.toggleChart();
              break;
            case 'steps':
              self.displayAllScenarios(scenarios);
              self.toggleSteps(steps);
              break;
            default:
              self.filterScenarios(btnState);
              break;
          }

        }, false);
      }
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
    }
  }

}());

