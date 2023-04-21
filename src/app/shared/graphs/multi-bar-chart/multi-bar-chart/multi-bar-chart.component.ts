import { Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, PLATFORM_ID } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-multi-bar-chart',
  templateUrl: './multi-bar-chart.component.html',
  styleUrls: ['./multi-bar-chart.component.scss']
})
export class MultiBarChartComponent implements OnInit {

  
  chartOptions: any;
  @Input() graphId: any;
  @Input() graphType: any;
  @Input() graphUseCaseId: any;
  @Input() horizontal: any;
  @Input() chartFilter: any;
  @Input() graphHeight: any;

  selectedGraphFilter: any;
  chartOptions1: any;
  finalObj: any = [];
  @Output() selectedFilters = new EventEmitter<string>();

  private chart: am4charts.XYChart;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private zone: NgZone) { }


  ngOnInit() {
    // for (let x = 0; x < this.chartOptions?.categories?.length; x++) {
    //   this.finalObj.push({ "name": this.chartOptions?.categories[x], "values": this.chartOptions?.values[x] });
    // }    

    this.chartOptions = [
      {fleet_name: "THisFleet", vehicle_count: 1},
      {fleet_name: "qwerty", vehicle_count: 13},
    ]
    this.generateChar(this.chartOptions);
  }

  generateChar(chartData: any) {
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);
      var chart = am4core.create("qqqqqqq", am4charts.XYChart);
      chart.data = chartData;
      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "fleet_name";
      categoryAxis.title.text = "Week";
      categoryAxis.renderer.grid.template.disabled = false;
      categoryAxis.renderer.grid.template.opacity = 1;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 0;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "No of Alerts";

      var series = chart.series.push(new am4charts.ColumnSeries3D());
      series.sequencedInterpolation = true;
      series.dataFields.valueY = "vehicle_count";
      series.dataFields.categoryX = "fleet_name";
      series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
      series.columns.template.strokeWidth = 0;

      series.columns.template.column.cornerRadiusTopLeft = 10;
      series.columns.template.column.cornerRadiusTopRight = 10;
      series.columns.template.column.fillOpacity = 1;
      series.columns.template.width = am4core.percent(50);
      var hoverState = series.columns.template.column.states.create("hover");
      hoverState.properties.cornerRadiusTopLeft = 0;
      hoverState.properties.cornerRadiusTopRight = 0;
      hoverState.properties.fillOpacity = 1;
      chart.cursor = new am4charts.XYCursor();
    });
  }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnChanges() {
    let colors = [
      "#008FFB",
      "#00E396",
      "#FEB019",
      "#FF4560"
    ]

    let graphData = {
      series: [],
      xaxis: null,
      chart: {
        height: this.graphHeight,
        type: "bar"
      },
      colors,
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      }
    }
    let categories: any = [];
    let seriesObj = {
      name: 'Count',
      data: []
    };
    this.chartOptions1 = graphData;
  }

  getSelectedGraphData(data:any) {
    this.selectedFilters.emit(data);
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
