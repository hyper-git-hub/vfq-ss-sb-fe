import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeviceFormComponent } from 'src/app/platform/smart-control/device-form/device-form.component';


import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

import { VAlertAction } from '../alert/alert.model';
import { AlertService } from '../alert/alert.service';
import { TableConfig } from '../general-table/model';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {

  @Input() panelTitle: string;
  @Input() deletionUrl: string;
  @Input() deviceType: string;

  @Input() count: number;

  @Input() filters: any;
  @Input() devOnOffConfig: any;
  @Input() breadCrumbs: any[];
  @Input() dataSource: any[];

  @Input() config: TableConfig;
  @Input() actions: Subject<any>;

  @Output() signals: EventEmitter<any> = new EventEmitter();

  loading: boolean;
  customerId: number;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private apiService: ApiService,
    private dialog: NgbModal,
    private toastr: ToastrService,
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

    this.panelTitle = 'Choose Parameters';
    this.deletionUrl = '';
    this.deviceType = '';

    let user: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = user.customer['customer_id'];

    this.actions = new Subject();
    this._unsubscribeAll = new Subject();
    this.config = null;
    this.devOnOffConfig = {
      action: 'turnOnSocket',
      payload: { power: '1' }
    };

    this.filters = { limit: 10, offset: '0', order_by: '', order: '', device_type: this.deviceType, customer_id: this.customerId };
    console.log("lsting filter:",this.filters)
    this.dataSource = [];
  }

  ngOnInit(): void {
    if (!!this.actions) {
      this.actions.pipe(takeUntil(this._unsubscribeAll)).subscribe((e: any) => {
        this.handleListActions(e);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.deletionUrl) {
      this.deletionUrl = changes.deletionUrl.currentValue;
    }
  }

  onTableSignals(ev: any) {
    // console.log("ev:", ev)
    this.signals.emit(ev);
    if (ev.type === 'onEdit') {
      this.onAddMainSocket(ev.row);
      // } else if (ev.type === 'onDelete') {
      //   this.onDeleteDevice();
      // } else if (ev.type === "onDeviceID") {
      //   this.router.navigate(['/ss/smart-control/socket-detail', ev.row['device']]);
      //   this.dss.shareData(ev.row);
    } else if (ev.type === 'onStatusChange') {
      this.setDeviceStatus(ev.data, ev.row);
    } else if (ev.type === 'onData') {
      // console.log(ev);
      const dt = ev.data['data'];
      if (!!dt) {
        dt.forEach(element => {
          if (!!element.floor_name) {
            element['floor_space'] = element.floor_name;
          } else if (!!element.open_area_name) {
            element['floor_space'] = element.open_area_name;
          }
        });
      }
    }
  }

  onAddMainSocket(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(DeviceFormComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.title = `Edit ${this.config.title}`;
    }

    dialogRef.closed.subscribe(() => {
      this.actions.next({ action: 'reload' });
    });
  }

  onDeleteDevice() {
    const slug = this.deletionUrl;
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
     console.log(ev);
     if (ev.type === 'reset') {
       this.filters = { limit: 10, offset: '0', device_type: this.deviceType, customer_id: this.customerId };
       this.actions.next({action: 'reset-filters', row: this.filters});
       for (const key in ev['filters']) {
         this.filters[key] = ev['filters'][key];
        }
        this.filters['device_type'] = this.deviceType;
        this.actions.next({ action: 'reload' });
        
      } else {
        for (const key in ev) {
          this.filters[key] = ev[key];
        }
        this.filters['device_type'] = this.deviceType;
      this.actions.next({ action: 'reload' });
    }
  }

  setDeviceStatus(ev: any, row: any) {
    this.actions.next({ action: 'loadingTrue' });
    const slug = `${environment.baseUrlDevice}/api/device/action`;
    let payload: any = {
      device_id: row.device,
      configuration: this.devOnOffConfig
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

  handleListActions(ev: any) {
    switch (ev?.action) {
      case 'reloadList':
        this.actions.next({ action: 'reload' });
        break;
      case 'deleteDevice':
        // console.log(ev);
        setTimeout(() => {
          this.onDeleteDevice();
        }, 500);
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    if (this._unsubscribeAll != null) {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }
  }
}
