import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { SCHEDULED, SCHEDULEDAYS, SchedulingTableConfig } from './config';
import { FORMATS } from 'src/app/shared/general-table/formats';

@Component({
  selector: 'app-device-scheduling',
  templateUrl: './device-scheduling.component.html',
  styleUrls: ['./device-scheduling.component.scss']
})
export class DeviceSchedulingComponent implements OnInit {

  loading: boolean;
  readonly: boolean;
  count: number;
  customerId: number;
  filters: any;
  deviceFilters: any;
  breadCrumbs: any[];
  deviceTypes: any[];
  scheduleList: any[];

  config: TableConfig;
  actions: Subject<any>;

  constructor(
    private dialog: NgbModal,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.loading = false;

    this.breadCrumbs = [
      {
        name: "Dashboard",
        url: "/ss/dashboard",
        icon: "ri-pie-chart-box-line"
      },
      {
        name: "Scheduling",
        url: "",
        icon: ""
      },
    ]
    this.deviceTypes = [
      { id: 'bulb', title: 'Bulb' },
      { id: 'socket', title: 'Socket' },
    ];
    this.scheduleList = [];
    this.deviceFilters = {};

    let user: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = user.customer['customer_id'];
    this.readonly = user.write ? false : true;
    this.filters = { limit: 10, offset: '0', customer_id: this.customerId };
    this.actions = new Subject();
    this.config = new TableConfig(SchedulingTableConfig.config);
  }

  ngOnInit(): void {
    this.defineFormats();
  }

  onTableSignals(ev: any) {
    // console.log(ev);
    if (ev.type === 'onEdit') {
      this.onCreateSchedule(ev.row);
    } else if (ev.type === 'onDelete') {
      this.onDeleteSchedule(ev.row);
    }
  }

  defineFormats() {
    FORMATS['schedule-status'] = SCHEDULED;
    FORMATS['schedule-days'] = SCHEDULEDAYS;
    // return FORMATS;
  }

  onFilterSignals(ev: any) {
    this.deviceFilters = ev;
  }

  onCreateSchedule(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(ScheduleFormComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.title = 'Edit Schedule';
    }

    dialogRef.closed.subscribe(() => {
      // this.getBulbListing(this.filterbulb);
      this.actions.next({ action: 'reload' });
    });
  }

  showList() {
    for (const key in this.deviceFilters) {
      if (!!this.deviceFilters[key]) {
        if (key != 'device_name') {
          this.filters[key] = this.deviceFilters[key];
        }
      }
    }
    setTimeout(() => {
      this.actions.next({ action: 'reload' });
    }, 100);
  }

  onReset() {
    this.actions.next({ type: 'reset' });
    this.filters = { limit: 10, offset: '0', customer_id: this.customerId };
    setTimeout(() => {
      this.actions.next({ action: 'reload' });
    }, 200);
  }

  onDeleteSchedule(ev: any) {
    AlertService.confirm('Are you sure?', 'You want to delete this schedule', 'Yes', 'No').subscribe((resp: VAlertAction) => {
      if (resp.positive) {
        this.actions.next({ action: 'loadingTrue' });
        const slug = `${environment.baseUrlDevice}/api/schedule-task/?device_id=${ev.device}&schedule_id=${ev.schedule_id}`;
        this.apiService.delete(slug).subscribe((resp: any) => {
          this.actions.next({ action: 'reload' });
        }, (err: any) => {
          this.actions.next({ action: 'loadingFalse' });
          this.toastr.error(err.error['message'], 'Error deleting schedule');
        });
      } else {
        return;
      }
    });
  }
}
