import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ShareDataService } from 'src/app/core/services/sharedData.service';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmBoxComponent } from 'src/app/shared/confirm-box/confirm-box.component';
import { FORMATS } from 'src/app/shared/general-table/formats';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment, ports } from 'src/environments/environment';
import { DeviceFormComponent } from '../device-form/device-form.component';
import { bulbTableConfig, STATUS } from './config';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';


@Component({
  selector: 'app-bulb',
  templateUrl: './bulb.component.html',
  styleUrls: ['./bulb.component.scss']
})
export class BulbComponent implements OnInit {
  loading: boolean;
  count: number;
  customerId: number;
  filterbulb: any;
  breadCrumbs: any[];
  cardsArray: any[];
  bulbListingData: any[];
  urlPort = ports;
  bulbTableConfig: TableConfig;
  actions: Subject<any>;

  constructor(
    private dialog: NgbModal,
    private apiService: ApiService,
    private dss: ShareDataService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loading = false;
    this.count = 0;

    this.breadCrumbs = [
      {
        name: "Smart Control",
        url: "/ss/smart-control/bulb",
        icon: "ri-u-disk-line"
      },
      {
        name: "Bulb",
        url: "",
        icon: ""
      },
    ]

    this.cardsArray = [
      {
        id: 10,
        name: 'Total Bulbs',
        url: './assets/images/cctv123.png ',
        data: 0
      },
      {
        id: 20,
        name: 'Online',
        url: './assets/images/icon-online.png ',
        data: 0
      },
      {
        id: 30,
        name: 'Offline',
        url: './assets/images/building.png ',
        data: 0
      },
      {
        id: 40,
        name: 'In-Schedule',
        url: './assets/images/geo-zone.png ',
        data: 0
      },
    ];

    this.bulbListingData = [];
    this.actions = new Subject();
    this.bulbTableConfig = new TableConfig(bulbTableConfig.config);

    let user: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = user.customer['customer_id'];
    this.filterbulb = { limit: 10, offset: '0', order_by: '', order: '', customer_id: this.customerId, device_type: 'bulb', search: '' };
  }

  ngOnInit(): void {
    this.defineFormats();
    this.getBulbListing(this.filterbulb);
    this.getBulbCards();
  }

  defineFormats() {
    return FORMATS['status'] = STATUS;
  }

  getBulbListing(filters: any): void {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    };
    // let params = `limit=${filters.limit}&offset=${filters.offset}&order=${filters.order}&order_by=${filters.order_by}&search=${filters.search}&customer_id=${this.customerId}&building=${filters.building}&floor=${filters.floor}&space=${filters.space}&space_attribute=${filters.space_attribute}&device_type=${filters.device_type}`;
    // this.buildingService.getBulbListing(params, this.urlPort.monolith)
    this.apiService.get(url.href).subscribe((resp: any) => {
      this.bulbListingData = [];
      this.bulbListingData = resp['data'].data;
      this.count = resp.data['count'];
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error.message);
    });
  }

  getBulbCards() {
    const slug = `${environment.baseUrlDashboard}/analytics/cards?dashboard_id=SMC&card_id=BC`;
    this.apiService.get(slug).subscribe((resp: any) => {
      const dt = resp.data[0];
      if (!!dt && dt['data']) {
        this.cardsArray[0].data = dt['data'].total;
        this.cardsArray[1].data = dt['data'].online;
        this.cardsArray[2].data = dt['data'].offline;
        this.cardsArray[3].data = dt['data'].in_schedule;
      }
    });
  }

  onTableSignals(ev: any) {
    // console.log(ev)
    if (ev.type === 'onEdit') {
      this.onAddMainbulb(ev.row);
    } else if (ev.type === 'onDelete') {
      this.onDelete(ev.row);
    } else if (ev.type === 'onPagination') {
      this.filterbulb.offset = ev.data['offset'];
      this.filterbulb.limit = ev.data['limit'];
      this.getBulbListing(this.filterbulb);
    } else if (ev.type === 'onSorting') {
      this.filterbulb.order = ev.data['direction'];
      this.filterbulb.order_by = ev.data['column'];
      this.getBulbListing(this.filterbulb);
    } else if (ev.type === "BulbDetail") {
      this.router.navigate(['/ss/smart-control/bulb-detail', ev.row['device']]);
      this.dss.shareData(ev.row);
    } else if (ev.type === 'searchTable') {
      this.filterbulb.search = ev.data;
      this.getBulbListing(this.filterbulb);
    } else if (ev.type === 'onDownload') {
      this.onDownload(this.filterbulb, ev.data);
    } else if (ev.type === 'onStatusChange') {
      this.setDeviceStatus(ev.data, ev.row);
    }
  }

  onAddMainbulb(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(DeviceFormComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.title = 'Edit Bulb';
    }

    dialogRef.closed.subscribe(() => {
      this.getBulbListing(this.filterbulb);
    });
  }

  onFilterSignals(ev: any) {
    // console.log(ev);
    if (!!ev.type && ev.type === 'reset') {
      this.filterbulb = { limit: 10, offset: '0', order_by: '', order: '', customer_id: this.customerId, device_type: 'bulb' };
      for (const key in ev['filters']) {
        if (!!ev[key]) {
          this.filterbulb[key] = ev['filters'][key];
        }
      }
    } else {
      for (const key in ev) {
        this.filterbulb[key] = ev[key];
      }
      this.filterbulb['device_type'] = 'bulb';
    }

    this.getBulbListing(this.filterbulb);
  }

  confirmDelete(ev?: any, cod?: number) {
    // console.log(ev)
    ev.item = ev.device;
    ev.delete = false;
    ev.inactive = false;
    ev.cancel = false;

    if (cod == 1) {
      ev.inactive = true;

    } else {
      ev.delete = true;
    }
    ev.cancel = true;
    const options: NgbModalOptions = { size: 'md', scrollable: true };
    const dialogRef = this.dialog.open(ConfirmBoxComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
    }

    dialogRef.closed.subscribe((result) => {
      if (result === 1) {
        this.confirmDelete(ev.device);
      }
    });

  }

  onDelete(ev: any) {
    AlertService.confirm('Are you sure?', 'You want to delete this device association', 'Yes', 'No').subscribe((resp: VAlertAction) => {
      if (resp.positive) {
        this.loading = true;
        const slug = `${environment.baseUrlDevice}/api/device?device_id=${ev.device}`;
        this.apiService.delete(slug).subscribe((resp: any) => {
          this.loading = false;
          this.toastr.success(resp.message, 'Successfully deleted', {
            progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
          });
          this.getBulbListing(this.filterbulb);
        }, (err: any) => {
          this.loading = false;
          this.toastr.error(err.error['message'], 'Error', {
            progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
          });
        });
      } else {
        return;
      }
    });
  }

  setDeviceStatus(ev: any, row: any) {
    this.loading = true;
    const slug = `${environment.baseUrlDevice}/api/device/action`;
    let payload: any = {
      device_id: row.device,
      configuration: {
        action: ev === true ? 'BulbPowerOn' : 'BulbPowerOff',
        payload: { power: ev === true ? '1' : '0' }
      }
    }

    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.loading = false;
    }, (err: any) => {
      row.device_online = ev ? false : true;
      this.actions.next({ action: 'setBtnStatus', row: row });
      this.loading = false;
      this.toastr.error(err.error['message']);
    });
  }

  onDownload(filters: any, type: string): void {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    };
    url.searchParams.set('export', type);
    let fileName = this.bulbTableConfig.title + ' List';

    this.apiService.getExportXlsPdf(url.href).subscribe((resp: any) => {
      if (type === 'pdf') {
        this.downloadPdf(resp, fileName);
      } else {
        this.downloadCSV(resp, fileName);
      }
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error.message);
    });
  }

  downloadPdf(resp: any, title: string) {
    const data = resp;
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob)

    let fileLink = document.createElement('a');
    fileLink.href = url
    fileLink.download = title;
    fileLink.click();
  }

  downloadCSV(resp: any, title: string) {
    const data = resp;
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob)

    let fileLink = document.createElement('a');
    fileLink.href = url
    fileLink.download = title;
    fileLink.click();
  }
}
