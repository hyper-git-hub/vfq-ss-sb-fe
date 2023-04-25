import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import * as dateFns from 'date-fns';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { ApiService } from 'src/app/services/api.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-energy-meter-details',
  templateUrl: './energy-meter-details.component.html',
  styleUrls: ['./energy-meter-details.component.scss'],
  providers: [DatePipe]
})
export class EnergyMeterDetailsComponent implements OnInit {

  loading: boolean;
  currLoading: boolean;
  voltageLoading: boolean;
  pcGraphLoading: boolean;
  deviceDetailUrl: string;

  payloadConfig: any;
  deviceId: any;
  buildingDetails: any;
  telemateryDetails: any;
  currGraphConfig: any;
  voltageGraphConfig: any;
  pcGraphConfig: any;

  table: any[];
  breadCrumbs: any[];
  pCData: any;
  currentGraphData: any[];
  voltageGraphData: any[];

  actions: Subject<any> = new Subject();
  signalRSubscription = new Subscription();

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private df: DatePipe,
    private signalR: SignalRService
  ) {
    this.loading = false;
    this.currLoading = false;
    this.voltageLoading = false;
    this.activatedRoute.paramMap.subscribe(data => {
      this.deviceId = data['params']['id'];
    });

    this.currentGraphData = [];
    this.voltageGraphData = [];
    this.pCData = [];

    this.breadCrumbs = [
      {
        name: "Device Details",
        url: "/ss/utilities/energy-meter",
        icon: "ri-boxing-line"
      },
      {
        name: "Energy Meter",
        url: "",
        icon: ""
      },
    ];

    this.table = [
      { id: 1, key: 'device_online', header: 'Status', value: 'Off' },
      { id: 2, key: 'device_type', header: 'Device Type', value: 'Electric Meter' },
      { id: 3, key: 'building_name', header: 'Building', value: '' },
      { id: 4, key: 'floor_name', header: 'Floor', value: '' },
      { id: 5, key: 'space_name', header: 'Space', value: '' },
      { id: 6, key: 'current', header: 'Current', value: '' },
      { id: 7, key: 'voltage', header: 'Voltage', value: '' },
      { id: 8, key: 'updated_at', header: 'Last Updated', value: '' },
      { id: 9, key: 'power', header: 'Power', value: '' }
    ]

    this.payloadConfig = {
      action: 'turnOnSocket',
      payload: { power: '1' }
    };

    this.deviceDetailUrl = `${environment.baseUrlSB}/building/smart_devices/?device=${this.deviceId}`;

    this.currGraphConfig = {
      cAxis: 'day', series: ['value']
    };
    this.voltageGraphConfig = {
      cAxis: 'day', series: ['value']
    }
    this.pcGraphConfig = {
      cAxis: 'day', series: ['value']
    }
  }

  ngOnInit(): void {
    this.getDeviceState();
    this.getBuildingDetails();
    this.getDeviceTelematery();
    this.getCurrentGraph();
    this.getVoltageGraph();
    this.getPCGraph();
    this.signalR.init(this.deviceId);
    this.setupSignalR();
  }

  getDeviceState() {
    this.loading = true;
    const slug = `${environment.baseUrlDevice}/api/device/state?device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      const dt = resp.data;
      this.table[0].value = dt.current_device_state ? 'On' : 'Off';
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message']);
    });
  }

  getBuildingDetails() {
    this.loading = true;
    const slug = `${environment.baseUrlSB}/building/smart_devices/?device=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.buildingDetails = resp.data['data'][0];

      this.table.forEach(ele => {
        for (const key in this.buildingDetails) {
          if (ele.key === key) {
            if (key === 'device_online') {
              // ele.value = this.buildingDetails[key] ? 'On' : 'Off';
            } else if (key === 'updated_at') {
              ele.value = this.df.transform(this.buildingDetails[key], 'dd-MM-yyyy, hh:mm a'); ``
            } else {
              ele.value = this.buildingDetails[key];
            }
          }
        }
      });
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting device details');
    });
  }

  getDeviceTelematery() {
    let url = new URL(`${environment.baseUrlDevice}/api/device/telemetry-data?use_case_id=5&device_id=${this.deviceId}`);

    this.apiService.get(url.href).subscribe((resp: any) => {
      const dt = resp.data;

      this.table[0].value = dt['device_online'] ? 'On' : 'Off';
      this.table[5].value = Number(dt['current']).toFixed(2).toString() + ' Amp';
      this.table[6].value = Number(dt['voltage']).toFixed().toString() + ' V';
      this.table[8].value = Number(dt['power']).toFixed(2).toString() + ' W';
    });
  }

  onDetailsSignals(ev: any) {
    // console.log(ev);
    if (ev.type === 'devStatus') {
      const dt = ev.data;
      // const action: 
    }
  }

  // getCurrentGraph() {
  //   this.graphData = [{
  //     "month": "Mon",
  //     "current": 23.5,
  //     "voltage": 21.1,
  //     // "lineColor": chart.colors.next()
  //   }, {
  //     "month": "Tue",
  //     "current": 26.2,
  //     "voltage": 30.5
  //   }, {
  //     "month": "Wed",
  //     "current": 30.1,
  //     "voltage": 34.9
  //   }, {
  //     "month": "Thu",
  //     "current": 20.5,
  //     "voltage": 23.1
  //   }, {
  //     "month": "Fri",
  //     "current": 30.6,
  //     "voltage": 28.2,
  //     // "lineColor": chart.colors.next()
  //   }, {
  //     "month": "Sat",
  //     "current": 34.1,
  //     "voltage": 31.9
  //   }, {
  //     "month": "Sun",
  //     "current": 34.1,
  //     "voltage": 31.9
  //   }];
  // }

  getCurrentGraph(period: any = 3) {
    this.currLoading = true;
    const slug = `${environment.baseUrlDashboard}/analytics/graphs?dashboard_id=UD&graph_id=EM&graph_type=current&filter=${period}&device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.currentGraphData = resp.data[0]['data'];
      this.currLoading = false;
    }, (err: any) => {
      this.currLoading = false;
      this.toastr.error(err.error['message'], 'Error getting current data for this device');
    });
  }

  getVoltageGraph(period: any = 3) {
    this.voltageLoading = true;
    const slug = `${environment.baseUrlDashboard}/analytics/graphs?dashboard_id=UD&graph_id=EM&graph_type=voltage&filter=${period}&device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.voltageGraphData = resp.data[0]['data'];
      this.voltageLoading = false;
    }, (err: any) => {
      this.voltageLoading = false;
      this.toastr.error(err.error['message'], 'Error getting voltage data for this device');
    });
  }

  getPCGraph(period: any = 3) {
    this.pcGraphLoading = true;
    const slug = `${environment.baseUrlDashboard}/analytics/graphs?dashboard_id=UD&graph_id=EM&graph_type=power&filter=${period}&device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      am4core.useTheme(am4themes_animated);
      this.pCData = resp.data[0]['data'];
      this.pcGraphLoading = false;
      // setTimeout(() => {
      //   this.generatePCGraph(resp.data['data']);
      // }, 200);
    }, (err: any) => {
      this.pcGraphLoading = false;
      this.toastr.error(err.error['message'], 'Error getting power consumption for this device');
    });
  }

  setupSignalR() {
    this.signalRSubscription = this.signalR.message.subscribe((resp: any) => {
      const signalRresponse = JSON.parse(resp);
      if (this.deviceId == signalRresponse.id) {
        console.log(signalRresponse);
        this.table[5].value = Number(signalRresponse.power).toFixed(2).toString() + ' Amp';
        this.table[6].value = Number(signalRresponse.voltage).toFixed().toString() + ' V';
        this.table[8].value = Number(signalRresponse.current).toFixed(2).toString() + ' W';
      }
    })
  }

  generatePCGraph(data: any) {
    let chart = am4core.create("pcchartdiv", am4charts.XYChart);
    // chart.data = generateChartData(data);
    chart.data = data;

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    dateAxis.renderer.minGridDistance = 50;
    // dateAxis.baseInterval= {timeUnit: 'day', count: 1};

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "day";
    series.strokeWidth = 2;
    series.minBulletDistance = 10;
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(12, 12, 12, 12)

    // Add scrollbar
    // chart.scrollbarX = new am4charts.XYChartScrollbar();
    // chart.scrollbarX['series'].push(series);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // function generateChartData(gData: any) {
    //   let chartData = [];
    //   let cd = [];
    //   for (const key in gData) {
    //     cd.push({key: key, value: gData[key]});
    //   }
    //   let dateNow = new Date();

    //   for (let i = 0; i < cd.length; i++) {
    //     chartData.push({
    //       date: dateFns.subDays(dateNow, i),
    //       value: cd[i]['value']
    //     });
    //   }

    //   return chartData;
    // }
  }

  onCurrGraphSignals(ev: any) {
    if (ev.data === 'today') {
      this.getCurrentGraph(1);
    } else if (ev.data === 'yesterday') {
      this.getCurrentGraph(2);
    } else if (ev.data === 'weekly') {
      this.getCurrentGraph(3);
    } else if (ev.data === 'monthly') {
      this.getCurrentGraph(4);
    } else if (ev.data === 'yearly') {
      this.getCurrentGraph(8);
    }
  }

  onVoltGraphSignals(ev: any) {
    if (ev.data === 'today') {
      this.getVoltageGraph(1);
    } else if (ev.data === 'yesterday') {
      this.getVoltageGraph(2);
    } else if (ev.data === 'weekly') {
      this.getVoltageGraph(3);
    } else if (ev.data === 'monthly') {
      this.getVoltageGraph(4);
    } else if (ev.data === 'yearly') {
      this.getVoltageGraph(8);
    }
  }

  onPCGraphSignals(ev: any) {
    if (ev.data === 'today') {
      this.getPCGraph(1);
    } else if (ev.data === 'yesterday') {
      this.getPCGraph(2);
    } else if (ev.data === 'weekly') {
      this.getPCGraph(3);
    } else if (ev.data === 'monthly') {
      this.getPCGraph(4);
    } else if (ev.data === 'yearly') {
      this.getPCGraph(8);
    }
  }

  ngOnDestroy(): void {
    if (this.signalRSubscription) {
      this.signalR.close();
      this.signalRSubscription.unsubscribe();
    }
  }
}
