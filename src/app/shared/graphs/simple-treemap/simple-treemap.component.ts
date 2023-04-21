import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);


@Component({
  selector: 'app-simple-treemap',
  templateUrl: './simple-treemap.component.html',
  styleUrls: ['./simple-treemap.component.scss']
})
export class SimpleTreemapComponent implements OnInit {

  @Input() chartOptions;
  private chart: am4charts.TreeMap;
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
    let chart = am4core.create("treemap", am4charts.TreeMap);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.data = graphData;;

    chart.colors.step = 2;

    // define data fields
    chart.dataFields.value = "value";
    chart.dataFields.name = "name";
    chart.dataFields.children = "children";

    chart.zoomable = false;
    let bgColor = new am4core.InterfaceColorSet().getFor("background");

    // level 0 series template
    let level0SeriesTemplate = chart.seriesTemplates.create("0");
    let level0ColumnTemplate = level0SeriesTemplate.columns.template;

    level0ColumnTemplate.column.cornerRadius(10, 10, 10, 10);
    level0ColumnTemplate.fillOpacity = 0;
    level0ColumnTemplate.strokeWidth = 10;
    level0ColumnTemplate.strokeOpacity = 0;

    // level 1 series template
    let level1SeriesTemplate = chart.seriesTemplates.create("1");
    let level1ColumnTemplate = level1SeriesTemplate.columns.template;

    level1SeriesTemplate.tooltip.animationDuration = 0;
    level1SeriesTemplate.strokeOpacity = 1;

    level1ColumnTemplate.column.cornerRadius(0, 0, 0, 0)
    level1ColumnTemplate.fillOpacity = 1;
    level1ColumnTemplate.strokeWidth = 0;
    level1ColumnTemplate.stroke = bgColor;

    let bullet1 = level1SeriesTemplate.bullets.push(new am4charts.LabelBullet());
    bullet1.locationY = 0.5;
    bullet1.locationX = 0.5;
    bullet1.label.text = "{name}";
    bullet1.label.fill = am4core.color("#ffffff");

    chart.maxLevels = 2;

    return chart;
  }
}