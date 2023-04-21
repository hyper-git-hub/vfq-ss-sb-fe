import { Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-gen-bar-chart',
  templateUrl: './gen-bar-chart.component.html',
  styleUrls: ['./gen-bar-chart.component.scss']
})
export class GenBarChartComponent implements OnInit {

  @Input() showDaysDropdown: boolean;
  @Input() showScrollbar: boolean;
  @Input() showBullet: boolean;
  @Input() simpleBarChart: boolean;

  @Input() graphID: string;
  @Input() graphTitle: string;
  @Input() seriesTitle: string;
  @Input() tooltipInfo: string;
  @Input() unit: string;
  @Input() graphHeight: string;

  @Input() graphConfig: any;
  @Input() graphData: any;

  @Output() signals: EventEmitter<any> = new EventEmitter();

  private chart: am4charts.XYChart;
  days: FormControl;

  constructor(
    private zone: NgZone,
  ) {
    this.showDaysDropdown = true;
    this.showScrollbar = false;
    this.showBullet = false;
    this.simpleBarChart = false;

    this.graphID = 'chart-div';
    this.graphTitle = 'Title';
    this.seriesTitle = '';
    this.tooltipInfo = 'Some help info goes here';
    this.unit = '';
    this.graphHeight = '300px';

    this.graphConfig = null;
    this.graphData = [];

    this.days = new FormControl('weekly');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.graphID) {
      this.graphID = changes.graphID.currentValue;
    }
    if (changes.graphData) {
      this.graphData = changes.graphData.currentValue;
      if (this.chart) this.chart.dispose();
      setTimeout(() => {
        this.chart = this.generateGraph(this.graphID);
      }, 100);
    }
  }

  ngOnInit(): void {
    this.days.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((val: any) => {
      if (!!val) {
        this.onSelectTime(val);
      }
    })
    // this.chart = this.generateGraph(this.graphID);
  }

  generateGraph(targetElement: any) {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_kelly);
    // Themes end

    var chart = am4core.create(targetElement, am4charts.XYChart);
    chart.data = this.graphData;

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.graphConfig['cAxis'];
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.ticks.template.disabled = true;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 30;
    // categoryAxis.renderer.line.opacity = 0;
    // categoryAxis.startLocation = 0.4;
    // categoryAxis.endLocation = 0.6;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    // valueAxis.renderer.line.opacity = 0;
    // valueAxis.min = 0;

    for (let i = 0; i < this.graphConfig.series.length; i++) {
      const sk = this.graphConfig.series[i];
      const t: string = this.graphConfig.series[i];
      const title = this.seriesTitle ? this.seriesTitle : t.replace(t[0], t[0].toUpperCase());

      const seriesType = this.simpleBarChart ? (new am4charts.ColumnSeries) : (new am4charts.ColumnSeries3D);
      const series = chart.series.push(seriesType);
      this.seriesConfig(series, chart, sk, title);
    }

    return chart;
  }

  seriesConfig(ls: any, chart: am4charts.XYChart, sKey: string, title: string) {
    ls.dataFields.categoryX = this.graphConfig['cAxis'];
    ls.dataFields.valueY = sKey;
    ls.tooltipText = title + ": {valueY.value} " + this.unit;
    ls.fillOpacity = 0.5;
    ls.strokeWidth = 3;
    ls.propertyFields.stroke = "lineColor";
    ls.propertyFields.fill = "lineColor";

    if (this.showBullet) {
      var bullet = ls.bullets.push(new am4charts.CircleBullet());
      bullet.circle.radius = 5;
      bullet.circle.fill = am4core.color("#fff");
      bullet.circle.strokeWidth = 3;
    }

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panX";
    chart.cursor.lineX.opacity = 0;
    chart.cursor.lineY.opacity = 0;

    if (this.showScrollbar) {
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.parent = chart.bottomAxesContainer;
    }
    return ls;
  }

  onSelectTime(ev: any) {
    this.signals.emit({type: this.graphID, data: ev});
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
