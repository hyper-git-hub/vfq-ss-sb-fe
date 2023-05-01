
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { FormConfig } from 'src/app/shared/general-forms/models';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';
import { DateUtils } from 'src/app/Utils/DateUtils';

import {
  alertsEventsTableConfig, cameraStatusTableConfig, emPCTableConfig, fdTableConfig, fvTableConfig, gmAlertTableConfig,
  occupancyTableConfig, reportFilterFormConfig, smokeAlertTableConfig, socketsPCTableConfig, temperatureTableConfig,
  userActivityTableConfig, waterLeakageTableConfig, waterPCTableConfig, wtTableConfig
} from './config';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe]
})
export class ReportsComponent implements OnInit {
  loading: boolean;
  count: number;
  customerId: number;
  reportsForm: FormGroup;

  config: TableConfig;
  reportFilterFormConfig: FormConfig;

  breadCrumbs: any[];
  reportsListingData: any[];
  deviceFilters: any;
  reportClass: any[] = [];
  reportTypes: any[] = [];
  devices: any[] = [];
  building: any[] = [];
  byFloor: any[] = [];
  floor: any[] = [];
  space: any[] = [];
  room: any[] = [];
  buildings: any[];
  openAreas: any[];
  contractStartDate: Date;
  reportsFilters: any;
  deviceTypeName: any = null;

  actions: Subject<any> = new Subject();
  @Output() signals: EventEmitter<any>;
  pageInfo = { pageIndex: 0, pageSize: 1, offset: 0 };

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private df: DatePipe
  ) {
    this.config = new TableConfig(socketsPCTableConfig.config);
    this.config.doApiCall = true;
    this.reportFilterFormConfig = new FormConfig(reportFilterFormConfig.config);
    this.actions = new Subject();

    this.loading = false;
    this.count = 0;
    this.customerId = 0;

    this.reportsListingData = [];

    this.breadCrumbs = [
      {
        name: 'Dashbaord',
        url: '/ss/dashboard/surveillance',
        icon: 'ri-numbers-line',
      },
      {
        name: 'Report',
        url: '',
        icon: '',
      },
    ];

    this.reportClass = [
      { id: 'surveillance', name: 'Surveillance' },
      { id: 'socket', name: 'Socket' },
      { id: 'energy_meter', name: 'Energy Meter' },
      { id: 'water_meter', name: 'Water Meter' },
      { id: 'smoke_alarm', name: 'Smoke Alarm' },
      { id: 'water_leakage', name: 'Water Leakage' },
      { id: 'temperature', name: 'Temperature' },
    ];

    this.reportTypes = [
      { id: 'socket_power_consumption_report', name: 'Socket Power Consumption', device_type: 'Socket' },
      { id: 'energy_meter_power_consumption_report', name: 'Energy Meter Power Consumption', device_type: 'Energy Meter' },
      { id: 'water_consumption_report', name: 'Water Consumption', device_type: 'Water Meter' },
      { id: 'smoke_alert_report', name: 'Smoke Alert', device_type: 'Smoke Alarm' },
      { id: 'water_leakage_report', name: 'Water Leakage', device_type: 'Water Leakage Sensor' },
      { id: 'temperature_report', name: 'Temperature', device_type: 'Temperature' },
      { id: 'camera_status_report', name: 'Camera Status Report', device_type: 'Camera' },
      { id: 'footage_viewer_report', name: 'Footage Viewer Report', device_type: 'Camera' },
      { id: 'footage_downloads_report', name: 'Footage Download Report', device_type: 'Camera' },
      { id: 'watch_time_report', name: 'Watch Time Report', device_type: 'Camera' },
      { id: 'geo_zone_motion_alert_report', name: 'Geo-zone Motion Alert', device_type: 'Camera' },
      { id: 'alert_and_event_trigger_report', name: 'Alert and event trigger', device_type: 'Camera' },
      { id: 'occupancy_report', name: 'Occupancy', device_type: 'Camera' },
      { id: 'user_activity_report', name: 'User Activity', device_type: 'Camera' },
    ];

    this.deviceTypeName = 'Socket';

    this.byFloor = [
      { id: 'floor', name: 'By Floor' },
      { id: 'openArea', name: 'By Open Area' },
    ];

    this.devices = [];
    this.building = [];
    this.floor = [];
    this.space = [];
    this.room = [];
    this.openAreas = [];

    this.deviceFilters = {
      limit: 10, offset: '0', order: '', order_by: '', export: '', date_filter: 'week',
      start_date: '', end_date: '', report_class: '', report_type: 'socket_power_consumption_report',
      building_id: '', open_area_id: '', floor_id: '', space_id: '',
      room_id: '', device_id: '',
    };

    this.reportsForm = new FormGroup({
      report_class: new FormControl('socket'),
      report_type: new FormControl('socket_power_consumption_report'),
      building_id: new FormControl(null),
      by_floor: new FormControl(null),
      open_area_id: new FormControl(null),
      floor_id: new FormControl(null),
      space_id: new FormControl(null),
      room_id: new FormControl(null),
      device_id: new FormControl(null),
      date_filter: new FormControl('week'),
      end_date: new FormControl(null),
      start_date: new FormControl(null),
    });
    this.signals = new EventEmitter();

    let user: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = user.customer['customer_id'];
    this.reportsFilters = { limit: 10, offset: '0', use_case_id: 5, date_filter: 'week', report_type: 'socket_power_consumption_report' };

    // this.reportsForm.get('report_type').valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((val: any) => {
    //   if (!!val) {
    //     this.makeConfig(val);
    //   }
    // });
  }

  ngOnInit(): void {
    this.getDevices();
    this.getBuildingList();
  }

  getDevices() {
    let url = new URL(`${environment.baseUrlDevice}/api/device?use_case_id=5`);
    url.searchParams.set('device_type_name', this.deviceTypeName);

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.devices = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }

  getReportsListing() {
    // const slug = `${environment.baseUrlDevice}/api/device/state?device_id=${this.deviceid}`;
    // this.apiService.get(slug).subscribe((resp: any) => {
    //     this.reportsListingData = resp.data;
    // }, (err: any) => {
    //     // this.toastr.error(err.error['message']);
    // });
  }

  makeConfig(val: any) {
    if (val === 'socket_power_consumption_report') {
      this.config = new TableConfig(socketsPCTableConfig.config);
    } else if (val === 'energy_meter_power_consumption_report') {
      this.config = new TableConfig(emPCTableConfig.config);
    } else if (val === 'water_consumption_report') {
      this.config = new TableConfig(waterPCTableConfig.config);
    } else if (val === 'smoke_alert_report') {
      this.config = new TableConfig(smokeAlertTableConfig.config);
    } else if (val === 'water_leakage_report') {
      this.config = new TableConfig(waterLeakageTableConfig.config);
    } else if (val === 'temperature_report') {
      this.config = new TableConfig(temperatureTableConfig.config);
    } else if (val === 'camera_status_report') {
      this.config = new TableConfig(cameraStatusTableConfig.config);
    } else if (val === 'footage_viewer_report') {
      this.config = new TableConfig(fvTableConfig.config);
    } else if (val === 'footage_downloads_report') {
      this.config = new TableConfig(fdTableConfig.config);
    } else if (val === 'watch_time_report') {
      this.config = new TableConfig(wtTableConfig.config);
    } else if (val === 'geo_zone_motion_alert_report') {
      this.config = new TableConfig(gmAlertTableConfig.config);
    } else if (val === 'alert_and_event_trigger_report') {
      this.config = new TableConfig(alertsEventsTableConfig.config)
    } else if (val === 'occupancy_report') {
      this.config = new TableConfig(occupancyTableConfig.config);
    } else if (val === 'user_activity_report') {
      this.config = new TableConfig(userActivityTableConfig.config);
    }
  }

  onSelectClass(ev: any) {
    this.deviceFilters.report_class = ev;
  }

  onSelectType(ev: any) {
    this.deviceFilters.report_type = ev;
    let idx = this.reportTypes.findIndex(ele => {
      return ele.id === ev;
    });
    if (idx != -1) {
      this.deviceTypeName = this.reportTypes[idx].device_type;
      this.getDevices();
    }
  }

  onSelectDevice(ev: any) {
    this.deviceFilters.device = ev;
  }

  onSelectBuilding(ev: any) {
    // console.log(' the value of ev ', ev);
    this.deviceFilters.building_id = ev;
    if (!!ev) {
      this.reportsForm.controls['by_floor']?.setValue(null);
      this.reportsForm.controls['floor_id']?.setValue(null);
      this.reportsForm.controls['space_id']?.setValue(null);
      this.reportsForm.controls['room_id']?.setValue(null);
      this.reportsForm.controls['open_area_id']?.setValue(null);
      this.floor = [];
      this.space = [];
      this.room = [];
      this.openAreas = [];
      this.getBuildingFloors(ev);
    }
  }

  onAreaSelect(ev: any) {
    if (ev === 'floor') {
      this.deviceFilters.open_area_id = '';
      this.reportsForm.get('floor_id').setValue(null);
      if (this.deviceFilters.building_id) {
        this.getBuildingFloors(this.deviceFilters.building_id);
      }
    } else {
      this.reportsForm.get('open_area_id').setValue(null);
      this.deviceFilters.floor_id = '';
      this.deviceFilters.space_id = '';
      this.deviceFilters.space_attribute_id = '';
      if (this.deviceFilters.building_id) {
        this.getBuildingOpenAreas(this.deviceFilters.building_id);
      }
    }
  }

  onSelectFloor(ev: any) {
    this.deviceFilters.floor_id = ev;
    if (!!ev) {
      this.space = [];
      this.room = [];
      this.openAreas = [];
      this.reportsForm.controls['space_id']?.setValue(null);
      this.reportsForm.controls['room_id']?.setValue(null);
      this.reportsForm.controls['open_area_id']?.setValue(null);
      this.getBuildingSpacesByFloor(ev);
    }
  }

  onSelectSpace(ev: any) {
    this.deviceFilters.space_id = ev;
    if (!!this.deviceFilters.floor_id && !!ev) {
      this.getRoomsBySpacesByFloor(this.deviceFilters.floor_id, ev);
    }
  }

  onSelectRoom(ev: any) {
    this.deviceFilters.space_attribute_id = ev;
  }

  onSelectOpenArea(ev: any) {
    // console.log(ev);
    this.deviceFilters.open_area_id = ev;
  }

  getBuildingList() {
    const slug = `${environment.baseUrlSB}/building/`;
    this.apiService.get(slug).subscribe(
      (resp: any) => {
        this.building = resp.data['data'];

        // console.log(' the value of ev ', this.building);
      },
      (err: any) => {
        this.toastr.error(
          err.error['message'],
          'Error getting data for filters'
        );
      }
    );
  }

  getBuildingFloors(ev: any) {
    const slug = `${environment.baseUrlSB}/building/floor/?building_id=${ev}`;
    this.apiService.get(slug).subscribe(
      (resp: any) => {
        this.floor = resp.data['data'];
      },
      (err: any) => {
        this.toastr.error(err.error['message']);
      }
    );
  }

  getBuildingSpacesByFloor(ev: any) {
    const slug = `${environment.baseUrlSB}/building/spacename/?floor_id=${ev}`;
    this.apiService.get(slug).subscribe(
      (resp: any) => {
        this.space = resp.data['data'];
      },
      (err: any) => {
        this.toastr.error(err.error['message']);
      }
    );
  }

  getRoomsBySpacesByFloor(fId: any, sId: any) {
    const slug = `${environment.baseUrlSB}/building/space/attribute/?floor_id=${fId}&space_id=${sId}`;
    this.apiService.get(slug).subscribe(
      (resp: any) => {
        this.room = resp.data['data'];
      },
      (err: any) => {
        this.toastr.error(err.error['message']);
      }
    );
  }

  getBuildingOpenAreas(ev: any) {
    const slug = `${environment.baseUrlSB}/building/openarea/?building_id=${ev}`;
    this.apiService.get(slug).subscribe(
      (resp: any) => {
        this.openAreas = resp.data['data'];
      },
      (err: any) => {
        this.toastr.error(err.error['message']);
      }
    );
  }

  changeGender(event) {
    this.deviceFilters.date_filter = (event.target.value);
    this.deviceFilters.end_date = '';
    this.deviceFilters.start_date = '';
    delete this.reportsFilters.start_date;
    delete this.reportsFilters.end_date;

  }

  // onGeneralFormSignal(ev: any) {
  //   if (ev.data.time_Interval === 'period') {

  //     let sd = this.df.transform(ev.data.start, 'dd-MM-yyyy hh:mm a');
  //     let date_end = this.df.transform(ev.data.end, 'dd-MM-yyyy hh:mm a');

  //     this.deviceFilters.end_date = date_end;
  //     this.deviceFilters.start_date = sd;
  //     this.deviceFilters.date_filter = '';
  //     delete this.reportsFilters.date_filter;
  //   }
  //   else {
  //     this.deviceFilters.end_date = '';
  //     this.deviceFilters.start_date = '';
  //     this.deviceFilters.date_filter = ev.data.time_Interval;
  //     delete this.reportsFilters.start_date;
  //     delete this.reportsFilters.end_date;
  //   }
  // }

  selectDateRange(event, time_type) { 
    let sd = this.df.transform(event, 'dd-MM-yyyy');
    let date_end = this.df.transform(event, 'dd-MM-yyyy');

    if (time_type == 'start') {
      this.deviceFilters.start_date = sd;
      this.deviceFilters.date_filter = '';
      delete this.reportsFilters.date_filter;

    } else {
      this.deviceFilters.end_date = date_end;
      this.deviceFilters.date_filter = '';
      delete this.reportsFilters.date_filter;
    }
  }

  showReport() {
    this.makeConfig(this.deviceFilters.report_type);
    for (const key in this.deviceFilters) {
      if (key === 'device') {
        this.reportsFilters['device_id'] = this.deviceFilters[key];
      } else {
        this.reportsFilters[key] = this.deviceFilters[key];
      }
      // if (!!this.deviceFilters[key]) {
      // }
    }

    this.actions.next({ action: 'reload' });
  }

  onTableSignal(ev: any) {
    // console.log(ev);
    if (ev.type === 'onData') {
      // const dt = ev.data['data'];
      // if (!!dt) {
      //   dt.forEach(element => {
      //     if (!!element.floor_name) {
      //       element['floor_space'] = element.floor_name;
      //     } else if (!!element.open_area_name) {
      //       element['floor_space'] = element.open_area_name;
      //     }
      //   });
      //   this.reportsListingData = dt;
      // }
    } else if (ev.type === 'onSorting') {
      this.deviceFilters.order = ev.data['direction'] === 'desc' ? 'descending' : 'ascending';
      this.deviceFilters.order_by = ev.data['column'];
      this.showReport();
    } else if (ev.type === 'onPagination') {
      this.deviceFilters.limit = ev.data['limit'];
      this.deviceFilters.offset = ev.data['offset'];
      this.showReport();
    } else if (ev.type === 'searchTable') {
      this.deviceFilters.search = ev.data;
      this.showReport();
    }
  }

  resetFilters() {
    this.reportsForm.reset();
    // this.actions.next({ type: 'onReset' });
    // this.reportsForm.controls['report_class']?.setValue('socket');
    this.reportsForm.controls['report_type']?.setValue('socket_power_consumption_report');
    this.reportsFilters = {};
    this.reportsFilters = { limit: 10, offset: '0', use_case_id: 5, report_type: 'socket_power_consumption_report' };
    this.deviceFilters = { limit: 10, offset: '0', use_case_id: 5, report_type: 'socket_power_consumption_report' };
    setTimeout(() => {
      this.showReport();

    }, 200);
  }
}
