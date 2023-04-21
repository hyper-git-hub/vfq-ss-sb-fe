import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ShareDataService } from 'src/app/core/services/sharedData.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment} from 'src/environments/environment';
import { waterLeakageTableConfig } from './config';

@Component({
  selector: 'app-water-leakage',
  templateUrl: './water-leakage.component.html',
  styleUrls: ['./water-leakage.component.scss']
})
export class WaterLeakageComponent implements OnInit {

  breadCrumbs: any[];
  filters: any;
  config: any;
  customerId: any;

  deletionUrl: string;
  action: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private dss: ShareDataService,
  ) {
    this.breadCrumbs = [
      {
        name: "Smart Alarm",
        url: "/ss/smart-alarm/water-leakage",
        icon: "ri-u-disk-line"
      },
      {
        name: "Water Leakage",
        url: "",
        icon: ""
      },
    ];

    this.deletionUrl = '';

    let u: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = u.customer['customer_id'];
    this.filters = { limit: 10, offset: '0', device_type: 'Water Leakage Sensor',customer_id: this.customerId, order_by: '', order: '', search: '', device: '', building: '', space: '', space_attribute: '', open_area: '', export: '' };
    this.config = new TableConfig(waterLeakageTableConfig.config);
  }
  ngOnInit(): void {
  }

  onDeviceSignals(ev: any) {
    // console.log(ev);
    if (ev.type === 'onDelete') {
      this.deletionUrl = `${environment.baseUrlDevice}/api/device?device_id=${ev.row['device']}`;
      this.action.next({action: 'deleteDevice'})
    } else if (ev.type === "onDeviceID") {
      // this.router.navigate(['/ss/smart-control/socket-detail', ev.row['device']]);
      this.router.navigate(['/ss/smart-alarm/water-leakage-detail', ev.row['device']]);
      this.dss.shareData(ev.row);
    }
  }
}
