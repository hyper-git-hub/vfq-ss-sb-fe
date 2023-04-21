import { Component, Input, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-pictorial-fraction-chart',
  templateUrl: './pictorial-fraction-chart.component.html',
  styleUrls: ['./pictorial-fraction-chart.component.scss']
})
export class PictorialFractionChartComponent implements OnInit {
  @Input() chartOptions;
  constructor() { }

  ngOnInit(): void {
    this.generateGraph(this.chartOptions)
  }

  generateGraph(graphData) {
    var iconPath = "M1 24v-2h2v-4h-2l1.996-4h.004v-14h18v14h.004l1.996 4h-2v4h2v2h-22zm4-1h4v-4h-4v4zm14-4h-4v4h4v-4zm-5 0h-4v4h4v-4zm6.386-4h-16.772l-1 2h18.772l-1-2zm-13.386-5h-2v2h2v-2zm8 0h-2v2h2v-2zm-4 0h-2v2h2v-2zm8 0h-2v2h2v-2zm-12-4h-2v2h2v-2zm8 0h-2v2h2v-2zm-4 0h-2v2h2v-2zm8 0h-2v2h2v-2zm-12-4h-2v2h2v-2zm8 0h-2v2h2v-2zm-4 0h-2v2h2v-2zm8 0h-2v2h2v-2z"
    let chart = am4core.create("pictorial", am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart.paddingLeft = 0;
    chart.data = graphData;
    let series = chart.series.push(new am4charts.PictorialStackedSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "name";
    series.alignLabels = true;
    // this makes only A label to be visible
    series.labels.template.propertyFields.disabled = "disabled";
    series.ticks.template.propertyFields.disabled = "disabled";

    series.maskSprite.path = iconPath;
    series.ticks.template.locationX = 1;
    series.ticks.template.locationY = 0;
    series.labelsContainer.width = 100;

    // chart.legend = new am4charts.Legend();
    // chart.legend.position = "top";
    // chart.legend.paddingRight = 160;
    // chart.legend.paddingBottom = 40;
    // let marker = chart.legend.markers.template.children.getIndex(0);
    // chart.legend.markers.template.width = 40;
    // chart.legend.markers.template.height = 40;
    // marker.cornerRadius(20,20,20,20);

  }
}
