import { Component, Input, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/animated";


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @Input() chartOptions;

  constructor() { }

  ngOnInit(): void {
    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);
    this.generateGraph(this.chartOptions)
  }

  generateGraph(graphData) {
    let chart = am4core.create("lineChart", am4charts.XYChart);

    let data = [];

    chart.data = [{
      "year": "Monday",
      "Temperature": 24,
      "Humidity": 18,
      "expenses": 21.1,
      "lineColor": chart.colors.next()
    }, {
      "year": "Tuesday",
      "Temperature": 21,
      "Humidity": 13,
      "expenses": 30.5
    }, {
      "year": "Wednesday",
      "Temperature": 22,
      "Humidity": 35,
      "expenses": 34.9
    }, {
      "year": "Thursday",
      "Temperature": 24,
      "Humidity": 13,
      "expenses": 23.1
    }, {
      "year": "Friday",
      "Temperature": 22,
      "Humidity": 19,
      "expenses": 28.2,
      "lineColor": chart.colors.next()
    }, {
      "year": "Saturday",
      "Temperature": 18,
      "Humidity": 21,
      "expenses": 31.9
    }
      , {
      "year": "Sunday",
      "Temperature": 18,
      "Humidity": 25,
      "expenses": 31.9
    }
    ];

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.ticks.template.disabled = true;
    categoryAxis.renderer.line.opacity = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.dataFields.category = "year";
    categoryAxis.startLocation = 0.4;
    categoryAxis.endLocation = 0.6;


    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.line.opacity = 0;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.min = 0;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.categoryX = "year";
    lineSeries.dataFields.valueY = "Temperature";
    lineSeries.tooltipText = "Temperature: {valueY.value}";
    lineSeries.fillOpacity = 0.5;
    lineSeries.strokeWidth = 3;
    lineSeries.propertyFields.stroke = "lineColor";
    lineSeries.propertyFields.fill = "lineColor";

    let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 6;
    bullet.circle.fill = am4core.color("#fff");
    bullet.circle.strokeWidth = 3;

    let lineSeries1 = chart.series.push(new am4charts.LineSeries());
    lineSeries1.dataFields.categoryX = "year";
    lineSeries1.dataFields.valueY = "Humidity";
    lineSeries1.tooltipText = "Humidity: {valueY.value}";
    lineSeries1.fillOpacity = 0.5;
    lineSeries1.strokeWidth = 3;
    lineSeries1.propertyFields.stroke = "lineColor";
    lineSeries1.propertyFields.fill = "lineColor";

    let bullet1 = lineSeries1.bullets.push(new am4charts.CircleBullet());
    bullet1.circle.radius = 6;
    bullet1.circle.fill = am4core.color("#fff");
    bullet1.circle.strokeWidth = 3;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panX";
    chart.cursor.lineX.opacity = 0;
    chart.cursor.lineY.opacity = 0;

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;

  }

}
