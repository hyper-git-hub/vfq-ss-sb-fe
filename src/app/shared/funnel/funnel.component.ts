import { Component, OnInit } from '@angular/core';
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

  graphData = [];
  constructor() { }

  ngOnInit(): void {
    this.graphData=[{
      "name": "Meeting Room 1",
      "value": 32
    }, {
      "name": "Conferance Room",
      "value": 30
    }, {
      "name": "Hall",
      "value": 25
    }, {
      "name": "Meeting Room 2",
      "value": 21
    }, {
      "name": "Lobby",
      "value": 18
    }, ]
    this.generateGraph()
  }
  generateGraph(){
  let chart = am4core.create("funnelchart", am4charts.SlicedChart);
chart.data = this.graphData;


let series = chart.series.push(new am4charts.FunnelSeries());
series.dataFields.value = "value";
series.dataFields.category = "name";


series.alignLabels = true;
series.labelsContainer.paddingLeft = 2;
series.labelsContainer.width = 100;
// series.fill = am4core.color("green");
// series.stroke = am4core.color("red");

// let fillModifier = new am4core.LinearGradientModifier();
// fillModifier.brightnesses = [-0.5, 1, -0.5];
// fillModifier.offsets = [0, 0.5, 1];
// series.slices.template.fillModifier = fillModifier;
// series.alignLabels = true;

// series.labels.template.text = "{category}: [bold]{value}[/]";


}
}