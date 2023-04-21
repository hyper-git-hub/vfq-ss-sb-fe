import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Helpers } from 'src/app/Utils/helpers';

import { ApiService } from 'src/app/services/api.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-temperature-detail',
  templateUrl: './temperature-detail.component.html',
  styleUrls: ['./temperature-detail.component.scss'],
  providers: [DatePipe]
})
export class TemperatureDetailComponent implements OnInit {

  loading: boolean;

  breadCrumbs: any[];
  table: any[];
  graphData: any[];

  customerId: number;

  filters: any;
  deviceId: any;
  deviceInfo: any;
  buildingDetails: any;
  telemateryDetails: any;
  tempGraphConfig: any;

  signalRSubscription = new Subscription();

  constructor(
    private df: DatePipe,
    private toastr: ToastrService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private signalR: SignalRService
  ) {
    this.loading = false;

    this.activatedRoute.paramMap.subscribe(data => {
      this.deviceId = data['params']['id'];
    });

    this.breadCrumbs = [
      {
        name: "Temperature",
        url: "/ss/temperature-detail",
        icon: "ri-u-disk-line"
      },
      {
        name: "Device Details",
        url: "",
        icon: ""
      },
    ]

    this.table = [
      { id: 1, key: 'building_name', header: 'Building', value: '-' },
      { id: 2, key: 'floor_name', header: 'Floor', value: '-' },
      { id: 3, key: 'space_name', header: 'Space', value: '-' },
      { id: 4, key: 'space_attribute_name', header: 'Room', value: '-' },
      { id: 5, key: 'temperature', header: 'Temperature', value: '-' },
      { id: 6, key: 'updated_at', header: 'Last Updated Time', value: '-' },
      { id: 7, key: 'humidity', header: 'Humidity', value: '-' },
    ]
    this.graphData = [];

    this.tempGraphConfig = {
      cAxis: 'day', series: ['temp', 'hum']
    };

    this.filters = { customer_id: '', device_type: '', device: '', building: '', floor_id: '', open_area: '' };

    let u: any = localStorage.getItem('user');
    const user = JSON.parse(u);
    this.customerId = user.customer['customer_id'];
    // this.filters.customer_id = this.customerId;
    this.filters.device = this.deviceId;
  }

  ngOnInit(): void {
    this.getBuildingDetails();
    this.getDeviceTelematery();
    this.getTemperatureGraph();
    this.signalR.init(this.deviceId);
    this.setupSignalR();
  }

  getBuildingDetails() {
    const slug = `${environment.baseUrlSB}/building/smart_devices/?device=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.buildingDetails = resp.data['data'][0];
      const dt = resp.data['data'][0];
      if (dt) {
        this.table[0].value = dt.building_name;
        this.table[1].value = dt.floor_name;
        this.table[2].value = dt.space_name;
        this.table[3].value = dt.space_attribute_name;
        this.table[5].value = this.df.transform(dt['updated_at'], 'dd-MM-yyyy, hh:mm a');

      }
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting device details');
    });
  }

  getDeviceTelematery() {
    let url = new URL(`${environment.baseUrlDevice}/api/device/telemetry-data?use_case_id=5&device_id=${this.deviceId}`);

    this.apiService.get(url.href).subscribe((resp: any) => {
      const dt = resp.data;
      this.table[4].value = resp.data['temperature'] ? Number(resp.data['temperature']).toFixed().toString() + 'C' : '';
      this.table[5].value = dt['updated_at'] ? this.df.transform(this.convertToSystemTime(dt['updated_at']), 'dd-MM-yyyy, hh:mm a') : '';
      this.table[6].value = resp.data['humidity'] ? Number(resp.data['humidity']).toFixed().toString() + '%' : '';
    });
  }

  getTemperatureGraph(period: any = 3) {
    const slug = `${environment.baseUrlDashboard}/analytics/graphs?dashboard_id=TD&graph_id=TS&filter=${period}&device_id=${this.deviceId}`;
    // const slug2 = `${environment.baseUrlDashboard}/analytics/graphs?dashboard_id=1&graph_id=12&graph_type=hum&device_id=${this.deviceId}`;
    // let temp_data: any[] = [];
    // let hum_data: any[] = [];
    this.loading = true;

    this.apiService.get(slug).subscribe((resp: any) => {
      this.graphData = resp.data[0]['data'];
      this.loading = false;
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error getting graph data for this device');
    });
  }

  setupSignalR() {
    this.signalRSubscription = this.signalR.message.subscribe((resp: any) => {
      const signalRresponse = JSON.parse(resp);
      if (this.deviceId == signalRresponse.id) {
        console.log(signalRresponse);
        this.table[4].value = signalRresponse['temp'] ? Number(signalRresponse['temp']).toFixed().toString() + 'C' : '';
        this.table[5].value = signalRresponse['t'] ? this.df.transform(this.convertToSystemTime(signalRresponse['t']), 'dd-MM-yyyy, hh:mm a') : '';
        this.table[6].value = signalRresponse['hum'] ? Number(signalRresponse['hum']).toFixed().toString() + '%' : '';
      }
    });
  }

  onTempGraphSignals(ev: any) {
    console.log(ev);
    if (ev.data === 'today') {
      this.getTemperatureGraph(1);
    } else if (ev.data === 'yesterday') {
      this.getTemperatureGraph(2);
    } else if (ev.data === 'weekly') {
      this.getTemperatureGraph(3);
    } else if (ev.data === 'monthly') {
      this.getTemperatureGraph(4);
    } else if (ev.data === 'yearly') {
      this.getTemperatureGraph(8);
    }
  }

  ngOnDestroy(): void {
    if (this.signalRSubscription) {
      this.signalR.close();
      this.signalRSubscription.unsubscribe();
    }
  }

  convertToSystemTime(t: any) {
    return Helpers.convertUTCtoLocalDatetime(t);
  }
}
