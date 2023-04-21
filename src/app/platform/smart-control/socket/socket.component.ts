import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ShareDataService } from 'src/app/core/services/sharedData.service';

import { ApiService } from 'src/app/services/api.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';
import { DeviceFormComponent } from '../device-form/device-form.component';
import { socketTableConfig } from './config';


@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.scss']
})
export class SocketComponent implements OnInit {
  loading: boolean;
  count: number;

  actions: Subject<any>;
  socketTableConfig: TableConfig;

  breadCrumbs: any[];
  socketListingData: any[]; 5

  socketFilters: any;
  customerId: any;

  constructor(
    private apiService: ApiService,
    private dss: ShareDataService,
    private dialog: NgbModal,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loading = false;
    this.count = 0;

    this.breadCrumbs = [
      {
        name: "Smart Control",
        url: "/ss/smart-control/socket",
        icon: "ri-u-disk-line"
      },
      {
        name: "Socket",
        url: "",
        icon: ""
      },
    ];

    this.actions = new Subject();
    this.socketTableConfig = new TableConfig(socketTableConfig.config);

    this.socketListingData = [];
    let u: any = localStorage.getItem('user');
    const user = JSON.parse(u);
    this.customerId = user.customer['customer_id'];
    this.socketFilters = { limit: 10, offset: '0', customer_id: this.customerId, device_type: 'socket', order_by: '', order: '', search: '', device: '', building: '', space: '', space_attribute: '', open_area: '', export: '' };
  }

  ngOnInit(): void {
    // this.getSocketListing(this.socketFilters);
  }

  getSocketListing(filters: any) {
    console.log(filters)
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.loading = false;
      this.count = resp.data['count'];
      this.socketListingData = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message'], '');
    });
  }

  onTableSignals(ev: any) {
    if (ev.type === 'onEdit') {
      this.onAddMainSocket(ev.row);
    } else if (ev.type === 'onDelete') {
      this.onDeleteSocket(ev.row);
    } else if (ev.type === "onDeviceID") {
      this.router.navigate(['/ss/smart-control/socket-detail', ev.row['device']]);
      this.dss.shareData(ev.row);
    } else if (ev.type === 'onStatusChange') {
      this.setDeviceStatus(ev.data, ev.row);
    }
  }

  onAddMainSocket(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(DeviceFormComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.title = 'Edit Socket';
    }

    dialogRef.closed.subscribe(() => {
      this.getSocketListing(this.socketFilters);
    });
  }

  onDeleteSocket(ev: any) {
    const slug = `${environment.baseUrlDevice}/api/device?device_id=${ev.device}`;
    AlertService.confirm('Are you sure?', 'You want to delete this device association', 'Yes', 'No').subscribe((resp: VAlertAction) => {
      if (resp.positive) {
        this.actions.next({ action: 'loadingtrue' });
        this.apiService.delete(slug).subscribe((resp: any) => {
          this.actions.next({ action: 'reload' });
        }, (err: any) => {
          this.actions.next({ action: 'loadingFalse' });
          this.toastr.error(err.error['messgae'], 'Error deleting device association');
        });
      } else {
        return;
      }
    });
  }

  onFilterSignals(ev: any) {
    console.log(ev)
    if (ev.type === 'reset') {
      this.socketFilters = { limit: 10, offset: '0', customer_id: this.customerId, device_type: 'socket' };
      for (const key in ev['filters']) {
        if (!!ev[key]) {
          this.socketFilters[key] = ev['filters'][key];
        }
      }
    } else {
      for (const key in ev) {
        this.socketFilters[key] = ev[key];
        // if (!!ev[key]) {
        // }
      }
      this.socketFilters['device_type'] = 'socket';
    }
    this.getSocketListing(this.socketFilters)
  }

  setDeviceStatus(ev: any, row: any) {
    this.actions.next({ action: 'loadingTrue' });
    const slug = `${environment.baseUrlDevice}/api/device/action`;
    let payload: any = {
      device_id: row.device,
      configuration: {
        action: ev === true ? 'turnOnSocket' : 'turnOffSocket',
        payload: { power: ev === true ? '1' : '0' }
      }
    }

    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.actions.next({ action: 'loadingFalse' });
    }, (err: any) => {
      row.device_online = ev ? false : true;
      this.actions.next({ action: 'setBtnStatus', row: row });
      this.actions.next({ action: 'loadingFalse' });
      this.toastr.error(err.error['message']);
    });
  }
}
