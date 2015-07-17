var app = app || {};

app.chart  = (function () {


  return {

    init: function () {
      var canvas = document.getElementById("chart"),
        chartCtx = canvas.getContext("2d"),
        statistics = this.getStatistics(),
        data = {
          numberOfParts: statistics.scenariosAmount,// total amount of scenarios
          parts: {"pt": [statistics.passed, statistics.failed]},//percentage of each parts
          colors: {"cs": ['#4CAF50', "#FF5252"]}//color of each part
        },
        self = this,
        chart;

      chart = new app.chart.Chart(chartCtx);
      chart.set(200, 200, 130, 0, Math.PI * 2, 70, "blue");
      chart.draw(data);

      var chartContainer = document.querySelector('.scenario-chart');

      chartContainer.addEventListener('webkitAnimationEnd', this.onAnimationEnd, false);
      chartContainer.addEventListener('animationend', this.onAnimationEnd, false);
      chartContainer.addEventListener('oanimationEnd', this.onAnimationEnd, false);
      chartContainer.addEventListener('MSAnimationEnd', this.onAnimationEnd, false);

      canvas.onmousemove = function (e) {
        var pos = self.findPos(this),
          x = e.pageX - pos.x,
          y = e.pageY - pos.y,
          c = this.getContext('2d'),
          p = c.getImageData(x, y, 1, 1).data,
          hex = "#" + ("000000" + self.rgbToHex(p[0], p[1], p[2])).slice(-6);

        /** Displaying text inside donut chart*/
        var a = 200;
        var b = 200;
        chartCtx.font = '30pt Arial';
        chartCtx.textAlign = 'center';
        chartCtx.fillStyle = hex;
        var statistics = self.getStatistics(),
            passed = statistics.passed,
            passedRound = Math.round(passed) + "%",
            failed = statistics.failed,
            failedRound = Math.round(failed) + "%";
        chartCtx.clearRect(120, 150, 150, 90);

        if (hex.toLowerCase() === data.colors.cs[0].toLowerCase()) {
          chartCtx.fillText(passedRound, a, b);
        } else if (hex.toLowerCase() === data.colors.cs[1].toLowerCase()) {
          chartCtx.fillText(failedRound, a, b);
        } else {
          chartCtx.fillText("", a, b);
        }
        chartCtx.textBaseline = 'middle';
      };

      document.querySelector('.close_chart').onclick = this.toggleChart.bind(this);
      document.querySelector('.document_container').onclick = this.toggleChart.bind(this);
    },
    /** Transforming rgb colors into Hex */
    rgbToHex: function (r, g, b) {
      if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
      return ((r << 16) | (g << 8) | b).toString(16);
    },
    /** Finding mouse position on chart */
    findPos: function(obj) {
      var curleft = 0, curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {x: curleft, y: curtop};
      }
    },
    /** Animated displaying and hiding chart */
    onAnimationEnd: function () {

      var documentContainer = document.querySelector('.document_container');

      if (documentContainer.classList.contains('backdrop-hidden')) {
        documentContainer.classList.remove('backdrop-hidden');
        documentContainer.style.display = 'none';
      }

      if (this.classList.contains('chart-hidden')) {
        this.classList.remove('chart-hidden');
        this.style.display = 'none';
      }
    },
    Chart: function (canvas) {


      this.x , this.y , this.radius , this.lineWidth , this.from, this.to = null;
      this.set = function (x, y, radius, from, to, lineWidth) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.from = from;
        this.to = to;
        this.lineWidth = lineWidth;
      };
      /** Drawing report chart */

      this.draw = function (data) {

        canvas.beginPath();
        canvas.lineWidth = this.lineWidth;
        canvas.arc(this.x, this.y, this.radius, this.from, this.to);
        canvas.strokeStyle = '#fff';
        canvas.stroke();
        var numberOfParts = data.numberOfParts;
        var parts = data.parts.pt;
        var colors = data.colors.cs;
        var df = 0;
        for (var i = 0; i < numberOfParts; i++) {
          canvas.beginPath();
          canvas.strokeStyle = colors[i];
          canvas.arc(this.x, this.y, this.radius, df, df + (Math.PI * 2) * (parts[i] / 100));
          canvas.stroke();
          df += (Math.PI * 2) * (parts[i] / 100);
        }
      };
    },
    /** Passed and failed percentage */
    getStatistics:function () {
      var scenarioPassed = document.querySelectorAll('.scenario.passed').length,
        scenarioFailed = document.querySelectorAll('.scenario.failed').length,
        scenariosAmount = document.querySelectorAll('.scenario').length,
        passed = (scenarioPassed / scenariosAmount) * 100,
        failed = (scenarioFailed / scenariosAmount) * 100,
        statistics;

      statistics = {
        scenariosAmount: scenariosAmount,
        passed: passed,
        failed: failed
      };

      return statistics;
    },

    toggleChartBackdrop: function () {
      var documentContainer = document.querySelector('.document_container');
      documentContainer.style.display = (documentContainer.style.display != 'block' ? 'block' : documentContainer.classList.add('backdrop-hidden'));
    },
    /** Displaying and hiding chart */
    toggleChart: function () {
      var chart = document.querySelector('.scenario-chart');

      if (chart.style.display != 'block' ) {
        chart.style.display = 'block';
        document.body.style.overflow = 'hidden';
      } else {
        chart.classList.add('chart-hidden');
        document.body.style.overflow = 'auto';
      }

      this.toggleChartBackdrop();
    }
  }

}());


