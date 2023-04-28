import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-simple-pie-chart',
  templateUrl: './simple-pie-chart.component.html',
  styleUrls: ['./simple-pie-chart.component.scss']
})
export class SimplePieChartComponent implements OnInit {
  @Input() chartOptions;

  private chart: am4charts.PieChart;
  constructor() { }

  ngOnInit(): void {
    this.chart = this.generateGraph(this.chartOptions)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartOptions) {
      this.chartOptions = changes.chartOptions.currentValue;
    }

    if (!!this.chartOptions) {
      if (this.chart) this.chart.dispose();
      this.chart = this.generateGraph(this.chartOptions);
    }
  }
  
  generateGraph(graphData) {
    let chart = am4core.create("simplepiechart", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = graphData;
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 180;
    chart.endAngle = 360;

    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "country";

    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;
    series.labels.template.disabled = true;
    // series.labels.template.maxWidth = 90;
    // series.labels.template.wrap = true;
    series.ticks.template.disabled = true;
    // series.labels.template.bent = true;
    // series.labels.template.radius = am4core.percent(-30);

    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;

    chart.legend = new am4charts.Legend();
    chart.legend.scrollable = true;
    chart.legend.maxHeight = 80
    return chart;
  }
}