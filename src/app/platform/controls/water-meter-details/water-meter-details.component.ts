import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-water-meter-details',
  templateUrl: './water-meter-details.component.html',
  styleUrls: ['./water-meter-details.component.scss'],
  providers: [DatePipe]
})
export class WaterMeterDetailsComponent implements OnInit {

  loading: boolean;
  graphLoading: boolean;
  deviceDetailUrl: string;

  payloadConfig: any;
  deviceId: any;
  buildingDetails: any;
  wmGraphConfig: any;

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
    this.graphLoading = false;
    this.activatedRoute.paramMap.subscribe(data => {
      this.deviceId = data['params']['id'];
    });

    this.breadCrumbs = [
      {
        name: "Device Details",
        url: "/ss/utilities/energy-meter",
        icon: "ri-boxing-line"
      },
      {
        name: "Water Meter",
        url: "",
        icon: ""
      },
    ];

    this.table = [
      { id: 1, key: 'device_online', header: 'Status', value: 'On' },
      { id: 2, key: 'device_type', header: 'Device Type', value: 'Electric Meter' },
      { id: 3, key: 'building_name', header: 'Building', value: 'Test Building' },
      { id: 4, key: 'floor_name', header: 'Floor', value: '2' },
      { id: 5, key: 'space_name', header: 'Space', value: '' },
      { id: 6, key: 'water_flow', header: 'Water Flow', value: '' },
    ]
    this.graphData = [];

    this.payloadConfig = {
      action: 'turnOnSocket',
      payload: { power: '1' }
    };

    this.deviceDetailUrl = `${environment.baseUrlSB}/building/smart_devices/?device=${this.deviceId}`;
    this.wmGraphConfig = {
      cAxis: 'day', series: ['value']
    };
  }

  ngOnInit(): void {
    this.getBuildingDetails();
    this.getDeviceTelematery();
    this.getWMGraph();
    this.signalR.init(this.deviceId);
    this.setupSignalR();
  }

  getDeviceTelematery() {
    let url = new URL(`${environment.baseUrlDevice}/api/device/telemetry-data?use_case_id=5&device_id=${this.deviceId}`);

    this.apiService.get(url.href).subscribe((resp: any) => {
      const dt = resp.data;
      this.table[0].value = dt['device_online'] ? 'On' : 'Off';
      this.table[5].value = dt['water_flow'] ? Number(dt['water_flow']).toFixed().toString() + ' (Ltrs)' : '';
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

  onDetailsSignals(ev: any) {
    console.log(ev);
    if (ev.type === 'devStatus') {
      const dt = ev.data;
      // const action: 
    }
  }

  onCurrGraphSignals(ev: any) {
    if (ev.data === 'today') {
      this.getWMGraph(1);
    } else if (ev.data === 'yesterday') {
      this.getWMGraph(2);
    } else if (ev.data === 'weekly') {
      this.getWMGraph(3);
    } else if (ev.data === 'monthly') {
      this.getWMGraph(4);
    } else if (ev.data === 'yearly') {
      this.getWMGraph(8);
    }
  }

  onVoltGraphSignals(ev: any) {
    console.log(ev);
  }
  onPCGraphSignals(ev: any) {
    console.log(ev);
  }

  getWMGraph(period: any = 3) {
    this.graphLoading = true;
    const slug = `${environment.baseUrlDashboard}/analytics/graphs?dashboard_id=UD&graph_id=WS&filter=${period}&device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.graphData = resp.data[0]['data'];
      this.graphLoading = false;
    }, (err: any) => {
      this.graphLoading = false;
      this.toastr.error(err.error['message'], 'Error getting water meter graph data for this device');
    });
  }

  setupSignalR() {
    this.signalRSubscription = this.signalR.message.subscribe((resp: any) => {
      const signalRresponse = JSON.parse(resp);
      if (this.deviceId == signalRresponse.id) {
        console.log(signalRresponse);
        this.table[5].value = Number(signalRresponse['water_flow']).toFixed().toString() + ' (Ltrs)';
      }
    })
  }

  ngOnDestroy(): void {
    if (this.signalRSubscription) {
      this.signalR.close();
      this.signalRSubscription.unsubscribe();
    }
  }
}
