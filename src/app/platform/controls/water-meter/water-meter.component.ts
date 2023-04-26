import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ShareDataService } from 'src/app/core/services/sharedData.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';

import { WaterMeterTableConfig } from './config';


@Component({
  selector: 'app-water-meter',
  templateUrl: './water-meter.component.html',
  styleUrls: ['./water-meter.component.scss']
})
export class WaterMeterComponent implements OnInit {

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
        name: "Utilities",
        url: "/ss/utilities/water-meter",
        icon: "ri-boxing-line"
      },
      {
        name: "Water Meter",
        url: "",
        icon: ""
      },
    ];

    this.deletionUrl = '';

    let u: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = u.customer['customer_id'];
    this.filters = { limit: 10, offset: '0', device_type: 'Water Meter',customer_id: this.customerId,  order_by: '', order: '', search: '', device: '', building: '', space: '', space_attribute: '', open_area: '', export: '' };
    this.config = new TableConfig(WaterMeterTableConfig.config);
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
      this.router.navigate(['/ss/utilities/water-meter-details', ev.row['device']]);
      this.dss.shareData(ev.row);
    }
  }
}
