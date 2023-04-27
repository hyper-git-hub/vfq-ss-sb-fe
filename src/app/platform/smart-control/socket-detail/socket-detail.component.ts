import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import * as dateFns from 'date-fns';

import { ShareDataService } from 'src/app/core/services/sharedData.service';
import { ApiService } from 'src/app/services/api.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { FORMATS } from 'src/app/shared/general-table/formats';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';

import { SocketScheduleFormComponent } from '../socket-schedule-form/socket-schedule-form.component';
import { SCHEDULEDAYS, socketDetailTableConfig, SOCKETSTATUS, STATUS } from './config';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import { SignalRService } from 'src/app/services/signal-r.service';
import { DateUtils } from 'src/app/Utils/DateUtils';


@Component({
  selector: 'app-socket-detail',
  templateUrl: './socket-detail.component.html',
  styleUrls: ['./socket-detail.component.scss']
})
export class SocketDetailComponent implements OnInit {
  loading: boolean;
  socketTurnOn: boolean;
  readonly: boolean;
  breadCrumbs: any[];

  sheduleListingData: any[];
  count: number = 0;
  socketDetailTableConfig: TableConfig;
  actions: Subject<any> = new Subject();

  customerId: number;

  socketFilters: any;
  filters: any;
  data: any;
  deviceId: any;
  deviceInfo: any;
  socketDetails: any;
  buildingDetails: any;
  telemateryDetails: any;
  signalRresponse: any;
  chartData: any;
  pcGraphConfig: any;

  signalRSubscription = new Subscription();

  constructor(
    private dialog: NgbModal,
    private dss: ShareDataService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private signalR: SignalRService
  ) {
    this.loading = false;

    this.activatedRoute.paramMap.subscribe(data => {
      this.deviceId = data['params']['id'];
    });

    this.customerId = 0;
    this.breadCrumbs = [
      {
        name: "Smart Control Detail",
        url: "/ss/smart-control/bulb-detail",
        icon: "ri-u-disk-line"
      },
      {
        name: "Socket",
        url: "",
        icon: ""
      },
    ]
    this.socketDetailTableConfig = new TableConfig(socketDetailTableConfig.config);

    this.sheduleListingData = [
      // { id: 1533, camera_name: 'CAM 07', camera_ip: 'Commercial', camera_id: '2', camera_username: 'Halway', room: 'Geo Zone', status: '1' },
      // { id: 1533, camera_name: 'CAM 07', camera_ip: 'Commercial', camera_id: '2', camera_username: 'Halway', room: 'Geo Zone', status: '1' },
    ];

    this.filters = { customer_id: '', device_type: '', device: '', building: '', floor_id: '', open_area: '' };
    this.socketFilters = { limit: 10, offset: '0', customer_id: '', device_type: '', device: '', building: '', floor_id: '', open_area: '' };
    this.data = null;
    this.telemateryDetails = {};
    let u: any = localStorage.getItem('user');
    const user = JSON.parse(u);
    this.customerId = user.customer['customer_id'];
    this.readonly = user.write ? false : true;
    // this.filters.customer_id = this.customerId;
    this.filters.device = this.deviceId;
    this.socketTurnOn = false;

    this.pcGraphConfig = {
      cAxis: 'day', series: ['value']
    }
  }

  ngOnInit(): void {
    this.socketFilters.customer_id = this.customerId;
    this.dss.getData().subscribe((data: any) => {
      if (!!data) {
        this.data = data;
        this.filters.device = this.deviceId ? this.deviceId : data.device;
        this.socketFilters.device = data.device;
        this.socketDetailTableConfig.doApiCall = true;
        this.actions.next({ action: 'reload' });
      } else {
        this.socketFilters.device = this.deviceId;
        this.filters.device = this.deviceId;
        this.socketDetailTableConfig.doApiCall = true;
        this.actions.next({ action: 'reload' });
      }
    });

    // this.getDeviceDetails();
    this.defineFormats();
    this.getDeviceState();
    this.getDeviceTelematery();
    this.getBuildingDetails(this.filters);
    this.getDevicePC();
    this.signalR.init(this.deviceId);
    this.setupSignalR();
  }

  defineFormats() {
    FORMATS['status'] = STATUS;
    FORMATS['socket-status'] = SOCKETSTATUS;
    FORMATS['schedule-days'] = SCHEDULEDAYS;
  }

  getDeviceState() {
    this.loading = true;
    const slug = `${environment.baseUrlDevice}/api/device/state?device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.deviceInfo = resp.data;
      this.loading = false;
      this.socketTurnOn = this.deviceInfo.current_device_state;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message']);
    });
  }

  getDeviceTelematery() {
    let url = new URL(`${environment.baseUrlDevice}/api/device/telemetry-data?use_case_id=5&device_id=${this.deviceId}`);

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.telemateryDetails = resp.data;
      this.telemateryDetails.power = Number(resp.data['power']).toFixed(2).toString() + ' W';
      this.telemateryDetails.voltage = Number(resp.data['voltage']).toFixed().toString() + ' V';
      this.telemateryDetails.current = Number(resp.data['current']).toFixed(2).toString() + ' mA';
    });
  }

  getDeviceDetails() {
    let url = new URL(`${environment.baseUrlDevice}/api/device?use_case_id=5&device_id=${this.deviceId}`);

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.socketDetails = resp.data['data'][0];
    });
  }

  getBuildingDetails(filters: any) {
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }
    this.apiService.get(url.href).subscribe((resp: any) => {
      this.buildingDetails = resp.data['data'][0];
    });
  }

  getDevicePC() {
    const slug = `${environment.baseUrlDashboard}/analytics/graphs?dashboard_id=SMC&graph_id=SS&device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      am4core.useTheme(am4themes_animated);
      this.chartData = resp.data[0];
      setTimeout(() => {
        this.generateGraph(resp.data[0]['data']);
      }, 200);
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error getting details of power consumption for this device');
    });
  }

  getDeviceSchedules(filters: any) {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/schedule_devices/`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.loading = false;
      this.sheduleListingData = resp.data['data'];
      this.count = resp.data['count'];
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message']);
    });
  }

  onTableSignals(ev: any) {
    // console.log(ev)
    if (ev.type === 'onEdit') {
      this.onAddSchedule(ev.row);
    } else if (ev.type === 'onDelete') {
      this.onDeleteSchedule(ev.row);
    }
  }

  onAddSchedule(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(SocketScheduleFormComponent, options);
    dialogRef.componentInstance.deviceId = !!this.deviceId ? this.deviceId : this.data.device;
    dialogRef.componentInstance.customerId = this.customerId;

    if (ev) {
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.title = 'Edit Schedule';
    }

    dialogRef.closed.subscribe(() => {
      this.actions.next({ action: 'reload' });
      // this.getDeviceSchedules(this.filters);
    });
  }

  onDeleteSchedule(row: any) {
    const slug = `${environment.baseUrlDevice}/api/schedule-task?schedule_id=${row.schedule_id}`;
    AlertService.confirm('Are you sure?', 'You want to delete this schedule', 'Yes', 'No').subscribe((resp: VAlertAction) => {
      if (resp.positive) {
        this.actions.next({ action: 'loadingTrue' });
        this.apiService.delete(slug).subscribe((resp: any) => {
          this.actions.next({ action: 'reload' });
        }, (err: any) => {
          this.actions.next({ action: 'loadingFalse' });
          this.toastr.error(err.error['message'], 'Error deleting schedule');
        });
      } else {
        return;
      }
    });
  }

  setOnOff(ev: any) {
    const onOff = ev.target['checked'];
    this.postDeviceAction(onOff);
  }

  postDeviceAction(ev: any) {
    this.loading = true;
    const slug = `${environment.baseUrlDevice}/api/device/action`;
    let payload: any = {
      device_id: this.deviceId,
      configuration: {
        action: ev === true ? 'turnOnSocket' : 'turnOffSocket',
        payload: { power: ev === true ? '1' : '0' }
      }
    }

    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.loading = false;
      this.socketTurnOn = resp.message.includes('turned off') ? false : true;
      this.getDeviceState();
    }, (err: any) => {
      this.loading = false;
      this.socketTurnOn = false;
      this.toastr.error(err.error['message']);
    });
  }

  generateGraph(data: any) {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_kelly);
    // Themes end

    var chart = am4core.create('chartdiv', am4charts.XYChart);
    chart.data = data;

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.ticks.template.disabled = true;
    categoryAxis.renderer.line.opacity = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.dataFields.category = 'day';
    categoryAxis.startLocation = 0.4;
    categoryAxis.endLocation = 0.6;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.line.opacity = 0;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.min = 0;

    for (let i = 0; i < this.pcGraphConfig.series.length; i++) {
      const sk = this.pcGraphConfig.series[i];
      const t: string = this.pcGraphConfig.series[i];
      const title = t.replace(t[0], t[0].toUpperCase());

      const series = chart.series.push(new am4charts.LineSeries());
      this.seriesConfig(series, chart, sk, title);
    }

    return chart;
  }

  seriesConfig(ls: any, chart: am4charts.XYChart, sKey: string, title: string) {
    // ls.stroke = am4core.color('#ffffff');

    ls.dataFields.categoryX = this.pcGraphConfig['cAxis'];
    ls.dataFields.valueY = sKey;
    ls.tooltipText = title + ": {valueY.value} " + 'W';
    ls.fillOpacity = 0.5;
    ls.strokeWidth = 3;
    ls.propertyFields.stroke = "lineColor";
    ls.propertyFields.fill = "lineColor";

    var bullet = ls.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 6;
    bullet.circle.fill = am4core.color("#fff");
    bullet.circle.strokeWidth = 3;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panX";
    chart.cursor.lineX.opacity = 0;
    chart.cursor.lineY.opacity = 0;

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    return ls;
  }

  setupSignalR() {
    this.signalRSubscription = this.signalR.message.subscribe((resp: any) => {
      const signalRresponse = JSON.parse(resp);
      if (this.deviceId == signalRresponse.id) {
        console.log(signalRresponse);
        this.signalRresponse = signalRresponse;
        this.telemateryDetails['power'] = Number(signalRresponse.power).toFixed(2).toString() + ' W';
        this.telemateryDetails['voltage'] = Number(signalRresponse.voltage).toFixed().toString() + ' V';
        this.telemateryDetails['current'] = Number(signalRresponse.current).toFixed(2).toString() + ' mA';
      }
    })
  }

  getLocalTime(datetime: any) {
    return DateUtils.convertUTCtoLocalDatetime(datetime);
  }

  ngOnDestroy(): void {
    if (this.signalRSubscription) {
      this.signalR.close();
      this.signalRSubscription.unsubscribe();
    }
  }
}




