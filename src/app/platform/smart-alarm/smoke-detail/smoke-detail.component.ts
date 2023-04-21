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
  selector: 'app-smoke-detail',
  templateUrl: './smoke-detail.component.html',
  styleUrls: ['./smoke-detail.component.scss'],
  providers:[DatePipe]
})
export class SmokeDetailComponent implements OnInit {

  loading: boolean;
  deviceDetailUrl: string;

  // payloadConfig: any;
  deviceId: any;
  buildingDetails: any;
  alertGraphConfig: any;

  table: any[];
  breadCrumbs: any[];
  graphData: any[];

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
    this.activatedRoute.paramMap.subscribe(data => {
      this.deviceId = data['params']['id'];
    });

    this.alertGraphConfig = {
      cAxis: 'Day', series: ['value']
    };

    this.breadCrumbs = [
      {
        name: "Smart Alarm",
        url: "/ss/smart-alarm/smoke-detail",
        icon: "ri-u-disk-line"
      },
      {
        name: "Smoke",
        url: "",
        icon: ""
      },
    ]

    this.table = [
      { id: 1, key: 'device_online', header: 'Status', value: 'On' },
      { id: 2, key: 'device_type', header: 'Device Type', value: 'Electric Meter' },
      { id: 3, key: 'building_name', header: 'Building', value: 'Test Building' },
      { id: 4, key: 'floor_name', header: 'Floor', value: '2' },
      { id: 5, key: 'space_name', header: 'Space', value: '' },
      { id: 6, key: 'last_alarm', header: 'Last Alarm', value: '' },
      { id: 7, key: 'updated_at', header: 'Last updated', value: '' },
    ]

    this.deviceDetailUrl = `${environment.baseUrlSB}/building/smart_devices/?device=${this.deviceId}`;
  }

  ngOnInit(): void {
    this.getDeviceTelematery();
    this.getBuildingDetails();
    this.getAlertGraphData();
    this.signalR.init(this.deviceId);
    this.setupSignalR();
  }

  getDeviceTelematery() {
    let url = new URL(`${environment.baseUrlDevice}/api/device/telemetry-data?use_case_id=5&device_id=${this.deviceId}`);

    this.apiService.get(url.href).subscribe((resp: any) => {
      const dt = resp.data;
      this.table[0].value = dt['device_online'] ? 'On' : 'Off';
      this.table[5].value = dt['track_time'] ? this.df.transform(this.convertToSystemTime(dt['track_time']), 'dd-MM-yyyy, hh:mm a') : '';
      this.table[6].value = dt['updated_at'] ? this.df.transform(this.convertToSystemTime(dt['updated_at']), 'dd-MM-yyyy, hh:mm a') : '';
    });
  }

  getAlertGraphData() {
    const slug = `${environment.baseUrlDashboard}/analytics/graphs?dashboard_id=SAD&graph_id=SA&device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      // let series = [["10:21", "11:22"], ["13:23", "14:24"], ["15:25"], ["16:26"], ["17:27"], ["18:28"], ["19:29"]]
      let gd: any[] = [];
      const dt = resp.data[0]['data'];
      if(dt)
      {
        dt['categories'].forEach((element, idx) => {
          gd.push({Day: element, value: dt['series'][idx].length});
        });
      }
      // console.log(gd);
      this.graphData = gd;
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error getting alerts for this device');
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
              ele.value = this.buildingDetails[key] ? 'On' : 'Off';
            } else if (key === 'updated_at') {
              // ele.value = this.df.transform(this.buildingDetails[key], 'dd-MM-yyyy, hh:mm a'); ``
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

  setupSignalR() {
    this.signalRSubscription = this.signalR.message.subscribe((resp: any) => {
      const signalRresponse = JSON.parse(resp);
      if (this.deviceId == signalRresponse.id) {
        console.log(signalRresponse);
        // this.table[5].value = signalRresponse['last_alarm'] ? this.df.transform(signalRresponse['last_alarm'], 'dd-MM-yyyy, hh:mm a') : '';
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
