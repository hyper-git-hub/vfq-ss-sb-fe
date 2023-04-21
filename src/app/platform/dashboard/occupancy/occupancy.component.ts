import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { TableConfig } from 'src/app/shared/general-table/model';
import { FormConfig } from 'src/app/shared/general-forms/models';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { DeviceFormComponent } from 'src/app/shared/device-form/device-form.component';
import { OccupancyTableConfig, OccupancyTimeFormConfig } from './config'


@Component({
  selector: 'app-occupancy',
  templateUrl: './occupancy.component.html',
  styleUrls: ['./occupancy.component.scss']
})
export class OccupancyComponent implements OnInit {

  formConfig: FormConfig;
  config: TableConfig;
  actions: Subject<any> = new Subject();

  breadCrumbs: any[];
  graphData: any;
  gData: any;
  filters: any;
  occupancyFilters: any;
  dataSource: any[];

  customerId: number;


  constructor(
    private dialog: NgbModal,
    private apiService: ApiService,
    private toastrService: ToastrService
  ) {

    this.actions = new Subject();

    this.formConfig = new FormConfig(OccupancyTimeFormConfig.config);
    this.config = new TableConfig(OccupancyTableConfig.config);


    this.breadCrumbs = [
      {
        name: "Dashboard",
        url: "/ss/dashboard/surveillance",
        icon: "ri-pie-chart-box-line"
      },
      {
        name: "Occupancy",
        url: '',
        icon: ""
      },
    ]

    this.graphData = {
      score: 98.7,
      gradingData: [
        // {
        //   title: "",
        //   color: "#0f9747",
        //   lowScore: 0,
        //   highScore: 20
        // },
        {
          title: "Under Flow",
          color: "#F7C631",
          lowScore: 0,
          highScore: 50
        },
        {
          title: "Over Flow ",
          color: "#ee1f25",
          lowScore: 50,
          highScore: 100
        }
      ]
    };

    // this.gData = this.graphData;

    const user: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = user.customer['customer_id'];
    this.filters = { limit: 10, offset: '0', order: '', order_by: '', customer_id: this.customerId, device_type: 'camera' };
    this.occupancyFilters = { dashboard_id: 'CO', graph_id: 'COG', start_date: '', end_date: '', filter: 1 };

    this.dataSource = [];
  }

  ngOnInit(): void {
    // this.getCameraListing(this.filters);
    this.getOccupancyGraph(this.occupancyFilters);
  }

  getCameraListing(filters: any) {
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.dataSource = resp.data['data'];
    }, (err: any) => {
      this.toastrService.error(err.error['message'], 'Error getting devices');
    });
  }

  getOccupancyGraph(filters: any) {
    this.actions.next({action: 'loadingTrue'});
    let url = new URL(`${environment.baseUrlDashboard}/analytics/graphs`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }
    
    this.apiService.get(url.href).subscribe((resp: any) => {
      const dt = resp.data[0];
      setTimeout(() => {
        if (dt) {
          this.graphData.score = dt.data[0]['value'];
          this.gData = this.graphData;
        }
      }, 1500);
      this.actions.next({action: 'loadingFalse'});
    }, (err: any) => {
      this.actions.next({action: 'loadingFalse'});
      this.toastrService.error(err.error['message']);
    });
  }

  onTableSignals(ev: any) {
    console.log(ev);
    if (ev.type === 'onEdit') {
      this.onEditCamera(ev.row);
    } else if (ev.type === 'onDelete') {
      this.onDelete(ev.row);
    } else if (ev.type === 'onDetails') {
      console.log('company cell clicked');
    }
  }

  onEditCamera(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(DeviceFormComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.title = 'Edit Camera Association';
    }

    dialogRef.closed.subscribe(() => {
      // this.getCameraListing(this.filters);
      this.actions.next({ action: 'reload' });
    });
  }

  onFilterSignals(ev: any) {
    for (const key in ev) {
      if (!!ev[key]) {
        this.filters[key] = ev[key];
        this.occupancyFilters[key] = ev[key];
      }
    }

    this.getOccupancyGraph(this.occupancyFilters);
  }

  onSubmit() {
    this.actions.next({ action: 'reload' });
  }

  onReset() {
    this.filters = { limit: 10, offset: '0', order: '', order_by: '', customer_id: this.customerId, device_type: 'camera' };
    this.actions.next({ type: 'reset' });
    this.actions.next({ type: 'onReset' });
    setTimeout(() => {
      this.actions.next({ action: 'reload' });
    }, 100);
  }

  onSelectTime(ev: any) {
    console.log(ev);
    if (ev.type === 'timeInterval') {
      const tFilter = ev.data;
      if (tFilter.value === 'today') {
        this.occupancyFilters.filter = 1;
      } else if (tFilter.value === 'last_week') {
        this.occupancyFilters.filter = 2;
      } else if (tFilter.value === 'last_month') {
        this.occupancyFilters.filter = 3;
      }
    } else if(ev.type === 'filterValues') {
      this.occupancyFilters.filter = '0';
      this.occupancyFilters.start_date = ev.data['start'];
      this.occupancyFilters.end = ev.data['end'];
    }

    console.log(this.occupancyFilters);
  }

  onDelete(row: any) {
    console.warn();
    ('Method not implemented.');
  }


}
