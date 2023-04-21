import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-hybrid-drill-down-chart',
  templateUrl: './hybrid-drill-down-chart.component.html',
  styleUrls: ['./hybrid-drill-down-chart.component.scss']
})
export class HybridDrillDownChartComponent implements OnInit, OnChanges {
  @Input() chartOptions;
  
  private chart: am4charts.GaugeChart;

  constructor() { }

  ngOnInit(): void {
    this.chart = this.generateGraph(this.chartOptions);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartOptions) {
      this.chartOptions = changes.chartOptions.currentValue;
    }

    if (this.chartOptions) {
      if (this.chart) this.chart.dispose();
      this.chart = this.generateGraph(this.chartOptions);
    }
  }
  
  generateGraph(graphData) {
    let chartMin = 0;
    let chartMax = 100;
    let data = graphData;

    if (!!graphData) {
      function lookUpGrade(lookupScore, grades) {
        // Only change code below this line
        for (var i = 0; i < grades.length; i++) {
          if (
            grades[i].lowScore < lookupScore &&
            grades[i].highScore >= lookupScore
          ) {
            return grades[i];
          }
        }
        return null;
      }
  
      // create chart
      let chart = am4core.create("chartdiv", am4charts.GaugeChart);
      chart.hiddenState.properties.opacity = 0;
      chart.fontSize = 11;
      chart.innerRadius = am4core.percent(80);
      chart.resizable = true;
  
      /*** Normal axis*/
      let axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
      axis.min = chartMin;
      axis.max = chartMax;
      axis.strictMinMax = true;
      axis.renderer.radius = am4core.percent(80);
      axis.renderer.inside = true;
      axis.renderer.line.strokeOpacity = 0.1;
      // axis.renderer.ticks.template.disabled = true;
      // axis.renderer.ticks.template.strokeOpacity = 1;
      // axis.renderer.ticks.template.strokeWidth = 0.5;
      // axis.renderer.ticks.template.length = 5;
      // axis.renderer.grid.template.disabled = true;
      // axis.renderer.labels.template.radius = am4core.percent(15);
      // axis.renderer.labels.template.fontSize = "0.9em";
  
      /*** Axis for ranges*/
      let axis2 = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
      axis2.min = chartMin;
      axis2.max = chartMax;
      axis2.strictMinMax = true;
      axis2.renderer.labels.template.disabled = true;
      axis2.renderer.ticks.template.disabled = true;
      axis2.renderer.grid.template.disabled = false;
      axis2.renderer.grid.template.opacity = 0.5;
      axis2.renderer.labels.template.bent = true;
      axis2.renderer.labels.template.fill = am4core.color("#000");
      axis2.renderer.labels.template.fontWeight = "bold";
      axis2.renderer.labels.template.fillOpacity = 0.3;
  
      /**Ranges*/
      for (let grading of data.gradingData) {
        let range = axis2.axisRanges.create();
        range.axisFill.fill = am4core.color(grading.color);
        range.axisFill.fillOpacity = 0.8;
        range.axisFill.zIndex = -1;
        // range.value = grading.lowScore > chartMin ? grading.lowScore : chartMin;
        range.value = grading.lowScore > chartMin ? grading.lowScore : chartMin;
        range.endValue = grading.highScore < chartMax ? grading.highScore : chartMax;
        range.grid.strokeOpacity = 0;
        // range.stroke = am4core.color("#A0CA92").lighten(-0.1);
        // axis2.renderer.grid.template.stroke = am4core.color("#A0CA92").lighten(-0.1);
        range.label.inside = true;
        range.label.text = grading.title.toUpperCase();
        range.label.inside = true;
        range.label.location = 0.5;
        range.label.inside = true;
        // range.label.radius = am4core.percent(10);
        range.label.paddingBottom = -5; // ~half font size
        range.label.fontSize = "0.9em";
      }
  
      let matchingGrade = lookUpGrade(data.score, data.gradingData);
  
      /*** Label 1*/
      let label = chart.radarContainer.createChild(am4core.Label);
      label.isMeasured = false;
      label.fontSize = "6em";
      label.x = am4core.percent(50);
      label.paddingBottom = 15;
      label.horizontalCenter = "middle";
      label.verticalCenter = "bottom";
      //label.dataItem = data;
      label.text = data.score.toFixed(1);
      //label.text = "{score}";
      label.fill = am4core.color(matchingGrade.color);
  
      /*** Label 2*/
      // let label2 = chart.radarContainer.createChild(am4core.Label);
      // label2.isMeasured = false;
      // label2.fontSize = "2em";
      // label2.horizontalCenter = "middle";
      // label2.verticalCenter = "bottom";
      // label2.text = matchingGrade.title.toUpperCase();
      // label2.fill = am4core.color(matchingGrade.color);
  
      /*** Hand*/
      let hand = chart.hands.push(new am4charts.ClockHand());
      hand.axis = axis2;
      hand.innerRadius = am4core.percent(55);
      hand.startWidth = 8;
      hand.pin.disabled = true;
      hand.value = data.score;
      hand.fill = am4core.color("#444");
      hand.stroke = am4core.color("#000");
  
      hand.events.on("positionchanged", function () {
        let matchingGrade = lookUpGrade(axis.positionToValue(hand.currentPosition), data.gradingData);
        label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
        label.fill = am4core?.color(matchingGrade?.color);
        label.stroke = am4core?.color(matchingGrade?.color);
        // let value2 = axis.positionToValue(hand.currentPosition);
        // label2.text = matchingGrade?.title.toUpperCase();
        // label2.fill = am4core?.color(matchingGrade?.color);
        // label2.stroke = am4core?.color(matchingGrade?.color);
      })
  
      // setInterval(function () {
      //   let value = chartMin + Math.random() * (chartMax - chartMin);
      //   hand.showValue(value, 1000, am4core.ease.cubicOut);
      // }, 2000);
      return chart;

    } else {
      return null;
    }

  }

}
