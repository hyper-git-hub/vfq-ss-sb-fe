import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-funnel',
  templateUrl: './funnel.component.html',
  styleUrls: ['./funnel.component.scss']
})
export class FunnelComponent implements OnInit {
  @Input() chartOptions: any;
  private chart: am4charts.SlicedChart;

  constructor() { }

  ngOnInit(): void {
    this.chart = this.generateGraph(this.chartOptions)
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.chartOptions = changes.chartOptions.currentValue;

    if (this.chartOptions) {
      this.chart = this.generateGraph(this.chartOptions);
    }
  }

  generateGraph(graphData) {
    if (this.chart) { this.chart.dispose(); }
    let chart = am4core.create("funnelchart", am4charts.SlicedChart);
    chart.data = graphData;

    let series = chart.series.push(new am4charts.FunnelSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "name";

    series.labels.template.text = "{category}: [bold]{value}[/]";
    series.alignLabels = true;
    // series.labelsContainer.width = 100;
    // series.fill = am4core.color("green");
    // series.stroke = am4core.color("red");
    // let fillModifier = new am4core.LinearGradientModifier();
    // fillModifier.brightnesses = [-0.5, 1, -0.5];
    // fillModifier.offsets = [0, 0.5, 1];
    // series.slices.template.fillModifier = fillModifier;
    // series.alignLabels = true;
    // series.labels.template.text = "{category}: [bold]{value}[/]";
    return chart;
  }
}