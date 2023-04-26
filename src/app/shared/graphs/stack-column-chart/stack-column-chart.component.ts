import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-stack-column-chart',
  templateUrl: './stack-column-chart.component.html',
  styleUrls: ['./stack-column-chart.component.scss']
})
export class StackColumnChartComponent implements OnInit {
  @Input() chartOptions;
  chart: am4charts.XYChart;
  constructor() { }

  ngOnInit(): void {
    this.chart = this.generateGraph(this.chartOptions)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartOptions) {
      this.chartOptions = changes.chartOptions.currentValue;
    }
    
    if (this.chartOptions) {
      if (this.chart) this.chart.dispose();
      this.chart = this.generateGraph(this.chartOptions)
    }
  }

  generateGraph(graphData) {
    let chart = am4core.create("stackchart", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.data = graphData;
    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);
    chart.legend = new am4charts.Legend();

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;


    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(80);
    series1.columns.template.tooltipText =
      "{name}: {valueY} ({valueY.totalPercent.formatNumber('#.00')}%)";
    series1.name = "Underflow Alert";
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "value1";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "vertical";

    let bullet1 = series1.bullets.push(new am4charts.LabelBullet());
    bullet1.interactionsEnabled = false;
    bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    bullet1.label.fill = am4core.color("#ffffff");
    bullet1.locationY = 0.5;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(80);
    series2.columns.template.tooltipText =
      "{name}: {valueY} ({valueY.totalPercent.formatNumber('#.00')}%)";
    series2.name = "Overflow Alert";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "value2";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "vertical";

    let bullet2 = series2.bullets.push(new am4charts.LabelBullet());
    bullet2.interactionsEnabled = false;
    bullet2.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    bullet2.locationY = 0.5;
    bullet2.label.fill = am4core.color("#ffffff");

    // let bullet3 = series3.bullets.push(new am4charts.LabelBullet());
    // bullet3.interactionsEnabled = false;
    // bullet3.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    // bullet3.locationY = 0.5;
    // bullet3.label.fill = am4core.color("#ffffff");

    // chart.scrollbarX = new am4core.Scrollbar();
    return chart;
  }
}