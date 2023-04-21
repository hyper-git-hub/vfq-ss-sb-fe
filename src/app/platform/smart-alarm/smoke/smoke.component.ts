import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ShareDataService } from 'src/app/core/services/sharedData.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';
import { smokeTableConfig } from './config';

@Component({
  selector: 'app-smoke',
  templateUrl: './smoke.component.html',
  styleUrls: ['./smoke.component.scss']
})
export class SmokeComponent implements OnInit {

  
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
        url: "/ss/smart-alarm/smoke",
        icon: "ri-u-disk-line"
      },
      {
        name: "Smoke",
        url: "",
        icon: ""
      },
    ];

    this.deletionUrl = '';

    let u: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = u.customer['customer_id'];
    this.filters = { limit: 10, offset: '0', device_type: 'smoke',customer_id: this.customerId, order_by: '', order: '', search: '', device: '', building: '', space: '', space_attribute: '', open_area: '', export: '' };
    this.config = new TableConfig(smokeTableConfig.config);
  }
  ngOnInit(): void {
  }

  onDeviceSignals(ev: any) {
    console.log(ev);
    if (ev.type === 'onDelete') {
      this.deletionUrl = `${environment.baseUrlDevice}/api/device?device_id=${ev.row['device']}`;
      this.action.next({action: 'deleteDevice'})
    } else if (ev.type === "onDeviceID") {
      // this.router.navigate(['/ss/smart-control/socket-detail', ev.row['device']]);
      this.router.navigate(['/ss/smart-alarm/smoke-detail', ev.row['device']]);
      this.dss.shareData(ev.row);
    }
  }
}
