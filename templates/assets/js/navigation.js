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

    showErrorDetails: function (e) {
        e.stopPropagation();
        var display = this.querySelector('.error-details').style.display;

        if (display === 'block') {
          this.querySelector('.error-details').style.display = 'none';
        } else {
          this.querySelector('.error-details').style.display = 'block';
        }
    },

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


    /** Filtering scenarios */
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

    /** Displaying all scenarios */
    displayAllScenarios: function (scenarios) {
      for (var i = 0; i < scenarios.length; i++) {
        if (scenarios[i].style.display != 'block') {
          scenarios[i].style.display = 'block';
        }
      }
    },
    /*
     * @param string buttonsList indicate the group of buttons that have the "active" class name
     *
     * Removing "active" class from all buttons except for the active one
     */
    removeActiveClass: function (buttonsList) {
      for (var j = 0; j < buttonsList.length; j++) {
        buttonsList[j].classList.remove('active');
      }
    },

    bindFilterButtonsEvent: function (filteringButtons, scenarios, steps) {
      var self = this,
        btnState;
      for (var k = 0; k < filteringButtons.length; k++) {
        filteringButtons[k].addEventListener('click', function () {

          btnState = this.dataset.state;

          if (btnState !== 'chart') {
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
              self.showSteps(steps);
              break;
            default:
              self.filterScenarios(btnState);
              break;
          }

        }, false);
      }
    },

    showSteps: function (steps) {
      for (var i = 0; i < steps.length; i++) {
        steps[i].style.display = 'block';
      }
    },

    hideSteps: function (steps) {
      for (var i = 0; i < steps.length; i++) {
        steps[i].style.display = 'none';
      }
    }
  }

}());

