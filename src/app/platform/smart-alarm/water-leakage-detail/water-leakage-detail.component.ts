import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { Helpers } from 'src/app/Utils/helpers';
import { ApiService } from 'src/app/services/api.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-water-leakage-detail',
  templateUrl: './water-leakage-detail.component.html',
  styleUrls: ['./water-leakage-detail.component.scss'],
  providers: [DatePipe]
})
export class WaterLeakageDetailComponent implements OnInit {

  loading: boolean;
  loadingGraph: boolean;
  deviceDetailUrl: string;

  // payloadConfig: any;
  deviceId: any;
  buildingDetails: any;
  alertGraphConfig: any;
  signalRresponse: any;

  table: any[];
  breadCrumbs: any[];
  graphData: any[];

  actions: Subject<any> = new Subject();
  signalRSubscription = new Subscription();


  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private signalR: SignalRService,
    private df: DatePipe
  ) {
    this.loading = false;
    this.loadingGraph = false;
    this.activatedRoute.paramMap.subscribe(data => {
      this.deviceId = data['params']['id'];
    });

    this.breadCrumbs = [
      {
        name: "Device Details",
        url: "/ss/smart-alarm/water-leakage",
        icon: "ri-u-disk-line"
      },
      {
        name: "Water Leakage",
        url: "",
        icon: ""
      },
    ]

    this.table = [
      { id: 1, key: 'connctivity_status', header: 'Connectivity Status', value: 'On' },
      { id: 2, key: 'device_type', header: 'Device Type', value: 'Electric Meter' },
      { id: 3, key: 'building_name', header: 'Building', value: 'Test Building' },
      { id: 4, key: 'floor_name', header: 'Floor', value: '2' },
      { id: 5, key: 'space_name', header: 'Space', value: '' },
      { id: 6, key: 'last_alarm', header: 'Last Alarm', value: '' },
      { id: 7, key: 'updated_at', header: 'Last Updated', value: '' },
    ]

    this.graphData = []

    this.deviceDetailUrl = `${environment.baseUrlSB}/building/smart_devices/?device=${this.deviceId}`;
    this.alertGraphConfig = {
      cAxis: 'day', series: ['value']
    }
  }

  ngOnInit(): void {
    this.getDeviceState();
    this.getDeviceTelematery();
    this.getBuildingDetails();
    this.getAlertGraph();
    this.signalR.init(this.deviceId);
    this.setupSignalR();
  }

  getDeviceState() {
    this.loading = true;
    const slug = `${environment.baseUrlDevice}/api/device/state?device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      const dt = resp.data;
      this.loading = false;
      this.table[0].value = dt.connectivity_status ? 'On' : 'Off';
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message']);
    });
  }

  getDeviceTelematery() {
    this.loading = true;
    let url = new URL(`${environment.baseUrlDevice}/api/device/telemetry-data?use_case_id=5&device_id=${this.deviceId}`);

    this.apiService.get(url.href).subscribe((resp: any) => {
      const dt = resp.data;
      this.table[5].value = dt['last_alarm'] ? this.df.transform(dt['last_alarm'], 'dd-MM-yyyy, hh:mm a') : '';
      this.table[6].value = dt['updated_at'] ? this.df.transform(this.convertToSystemTime(dt['updated_at']), 'dd-MM-yyyy, hh:mm a') : '';
      this.loading = false;
    });
  }

  getBuildingDetails() {
    this.loading = true;
    const slug = `${environment.baseUrlSB}/building/smart_devices/?device=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      const dt = resp.data['data'][0];
      this.buildingDetails = resp.data['data'][0];
      this.table[1].value = dt.device_type;
      this.table[2].value = dt.building_name;
      this.table[3].value = dt.floor_name;
      this.table[4].value = dt.space_name;
      this.table[6].value = this.df.transform(dt.updated_at, 'dd-MM-yyyy, hh:mm a');
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting device details');
    });
  }

  getAlertGraph() {
    this.loadingGraph = true;
    const slug = `${environment.baseUrlDashboard}/analytics/graphs?dashboard_id=SAD&graph_id=WLS&device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.graphData = resp.data[0]['data'];
      this.loadingGraph = false;
    }, (err: any) => {
      this.loadingGraph = false;
      this.toastr.error(err.error['message'], 'Error getting alert graph data');
    });
  }

  onDetailsSignals(ev: any) {
    // console.log(ev);
    if (ev.type === 'devStatus') {
      const dt = ev.data;
      // const action: 
    }
  }

  setupSignalR() {
    this.signalRSubscription = this.signalR.message.subscribe((resp: any) => {
      const signalRresponse = JSON.parse(resp);
      if (this.deviceId == signalRresponse.id) {
        console.log(signalRresponse);
        this.signalRresponse = signalRresponse;
        this.table[6].value = signalRresponse['t'] ? this.df.transform(this.convertToSystemTime(signalRresponse['t']), 'dd-MM-yyyy, hh:mm a') : '';
      }
    })
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
