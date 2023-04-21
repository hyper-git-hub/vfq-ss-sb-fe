import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ShareDataService } from 'src/app/core/services/sharedData.service';
import { ApiService } from 'src/app/services/api.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';
import { temperatureTableConfig } from './config';

@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.scss']
})
export class TemperatureComponent implements OnInit {

  loading: boolean;
  count: number;

  actions: Subject<any>;
  temperatureTableConfig: TableConfig;

  breadCrumbs: any[];
  temperatureListingData: any[];

  temperatureFilters: any;
  customerId: any;
  deletionUrl: string;
  action: Subject<any> = new Subject();

  constructor(
    private apiService: ApiService,
    private dss: ShareDataService,
    // private dialog: NgbModal,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loading = false;
    this.count = 0;

    this.breadCrumbs = [
      {
        name: "Temperatures",
        url: "/ss/temperature",
        icon: "ri-temp-hot-line"
      },
      {
        name: "Temperature",
        url: "",
        icon: ""
      },
    ];

    this.actions = new Subject();
    this.temperatureTableConfig = new TableConfig(temperatureTableConfig.config);

    this.temperatureListingData = [];
    let u: any = localStorage.getItem('user');
    const user = JSON.parse(u);
    this.customerId = user.customer['customer_id'];
    this.temperatureFilters = { limit: 10, offset: '0',  device_type: 'temperature',customer_id: this.customerId, order_by: '', order: '' };
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
      this.router.navigate(['/ss/temperature/temperature-detail', ev.row['device']]);
      this.dss.shareData(ev.row);
    }
  }

  // gettemperatureListing(filters: any) {
  //   this.loading = true;
  //   let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
  //   for (const key in filters) {
  //     if (!!filters[key]) {
  //       url.searchParams.set(key, filters[key]);
  //     }
  //   }

  //   this.apiService.get(url.href).subscribe((resp: any) => {
  //     this.loading = false;
  //     this.count = resp.data['count'];
  //     this.temperatureListingData = resp.data['data'];
  //   }, (err: any) => {
  //     this.toastr.error(err.error['message'], '');
  //   });
  // }

  // onTableSignals(ev: any) {
  //   if (ev.type === 'onEdit') {
  //     this.onAddMainTemperature(ev.row);
  //   } else if (ev.type === 'onDelete') {
  //     this.onDeleteTemperature(ev.row);
  //   } else if (ev.type === "onDeviceID") {
  //     this.router.navigate(['/ss/temperature/temperature-detail', ev.row['device']]);
  //     this.dss.shareData(ev.row);
  //   }
  // }

  // onAddMainTemperature(ev?: any) {
    // const options: NgbModalOptions = { size: 'lg', scrollable: true };
    // const dialogRef = this.dialog.open(SocketMainFormComponent, options);

    // if (ev) {
    //   dialogRef.componentInstance.data = ev;
    //   dialogRef.componentInstance.title = 'Edit Socket';
    // }

    // dialogRef.closed.subscribe(() => {
    //   this.getSocketListing(this.temperatureFilters);
    // });
  // }

  // onDeleteTemperature(ev: any) {
  //   const slug = `${environment.baseUrlDevice}/api/device?device_id=${ev.device}`;
  //   AlertService.confirm('Are you sure?', 'You want to delete this device association', 'Yes', 'No').subscribe((resp: VAlertAction) => {
  //     if (resp.positive) {
  //       this.actions.next({action: 'loadingtrue'});
  //       this.apiService.delete(slug).subscribe((resp: any) => {
  //         this.actions.next({action: 'reload'});
  //       }, (err: any) => {
  //         this.actions.next({action: 'loadingFalse'});
  //         this.toastr.error(err.error['messgae'], 'Error deleting device association');
  //       });
  //     } else {
  //       return;
  //     }
  //   });
  // }

  // onFilterSignals(ev: any) {
  //   for (const key in ev) {
  //     this.temperatureFilters[key] = ev[key];
  //   }
  //   this.actions.next({ action: 'reload' });

  // }
}
