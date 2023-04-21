import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input() chartOptions;
  private chart: am4charts.PieChart;

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
    let chart = am4core.create("piechart", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    
    chart.data  = graphData;
    
    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.radiusValue = "value";
    series.dataFields.category = "country";
    series.slices.template.cornerRadius = 6;
    series.colors.step = 3;
    
    series.hiddenState.properties.endAngle = -90;
    
    chart.legend = new am4charts.Legend();

    return chart;
  }
}
