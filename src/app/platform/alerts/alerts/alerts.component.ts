import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';
import { AlertFormComponent } from '../alert-form/alert-form.component';
import { GeozoneTableConfig, HumidityTableConfig, OccupancyTableConfig, SmokeAlertsTableConfig, TemperatureTableConfig, WaterLeakageTableConfig } from './config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  loading: boolean;
  readonly: boolean;

  smokeFilters: any;
  waterLeakageFilters: any;
  occupancyFilters: any;
  temperatureFilters: any;
  humidityFilters: any;
  geozoneFilters: any;

  active: string;
  buttons: string
  breadCrumbs: any[];
  smokeAlertsData: any[];
  buildingFilters: any;
  deviceFilters: any

  alertTypes: any[];
  devices: any[] = [];
  buildings: any[] = [];
  areaTypes: any[] = [];
  floors: any[] = [];
  spaces: any[] = [];
  rooms: any[] = [];
  openAreas: any[] = [];

  smokeConfig: TableConfig;
  waterLeakageConfig: TableConfig;
  occupancyConfig: TableConfig;
  temperatureConfig: TableConfig;
  humidityConfig: TableConfig;
  geozoneConfig: TableConfig;
  actions: Subject<any>;

  alertFilterForm: FormGroup;
  customerId: number;

  constructor(
    private dialog: NgbModal,
    private apiService: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.loading = false;
    this.active = 'smoke';
    this.breadCrumbs = [
      {
        name: "Dashboard",
        url: "/ss/dashboard",
        icon: "ri-pie-chart-box-line"
      },
      {
        name: "Alerts",
        url: "",
        icon: ""
      },
    ];

    let u: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = u.customer['customer_id'];
    this.readonly = u.write ? false : true;


    this.smokeAlertsData = [];
    this.smokeFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'Smoke Alarm', search: '', customer_id: this.customerId };
    this.waterLeakageFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'Water Leakage Sensor', search: '', customer_id: this.customerId };
    this.occupancyFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'Occupancy', search: '', customer_id: this.customerId };
    this.temperatureFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'Temperature', search: '', customer_id: this.customerId };
    this.humidityFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'Humidity', search: '', customer_id: this.customerId };
    this.geozoneFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'geozone', search: '', customer_id: this.customerId };

    this.smokeConfig = new TableConfig(SmokeAlertsTableConfig.config);
    this.waterLeakageConfig = new TableConfig(WaterLeakageTableConfig.config);
    this.occupancyConfig = new TableConfig(OccupancyTableConfig.config);
    this.temperatureConfig = new TableConfig(TemperatureTableConfig.config);
    this.humidityConfig = new TableConfig(HumidityTableConfig.config);
    this.geozoneConfig = new TableConfig(GeozoneTableConfig.config);
    this.actions = new Subject();

    this.deviceFilters = { device: '', building: '', space: '', space_attribute: '', open_area: '', export: '' };
    this.buildingFilters = { device_type: 'smoke', customer_id: this.customerId, device: '' };

    this.alertTypes = [
      { id: 'Smoke Alarm', name: 'Smoke', packet_key: 'fire_status', device_type: 'smoke', tab_name: 'smoke' },
      { id: 'Water Leakage Sensor', name: 'Water Leakage', packet_key: 'leakage_status', device_type: 'Water Leakage Sensor', tab_name: 'water-leakage' },
      { id: 'Occupancy', name: 'Occupancy', packet_key: 'occupancy', device_type: 'camera', tab_name: 'occupancy' },
      { id: 'Temperature', name: 'Temperature', packet_key: 'temp', device_type: 'temperature', tab_name: 'temperature' },
      { id: 'Humidity', name: 'Humidity', packet_key: 'hum', device_type: 'temperature', tab_name: 'humidity' },
    ];

    this.buildings = [];
    this.areaTypes = [
      { id: 'floor', name: 'Floor' },
      { id: 'open_area', name: 'Open Area' },
    ];
    this.floors = [];
    this.spaces = [];
    this.rooms = [];
    this.openAreas = [];

    this.alertFilterForm = this.fb.group({
      alert_type: ['Smoke Alarm', [Validators.required]],
      device_type: [null],
      device: [null, [Validators.required]],
      building: [null],
      area_type: [null],
      floor: [null],
      space: [null],
      room: [null],
      open_area: [null],
    });
  }

  ngOnInit(): void {
    this.getBuildingList();
    this.getCustomerDevice(this.buildingFilters);
  }

  getBuildingList() {
    const slug = `${environment.baseUrlSB}/building/?customer_id=${this.customerId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.buildings = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error getting data for filters');
    });
  }

  getBuildingFloors(ev: any) {
    const slug = `${environment.baseUrlSB}/building/floor/?building_id=${ev}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.floors = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }

  getBuildingSpacesByFloor(ev: any) {
    const slug = `${environment.baseUrlSB}/building/space/?floor_id=${ev}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.spaces = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }

  getRoomsBySpacesByFloor(fId: any, sId: any) {
    const slug = `${environment.baseUrlSB}/building/space/attribute/?floor_id=${fId}&space_id=${sId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.rooms = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }

  getBuildingOpenAreas(ev: any) {
    const slug = `${environment.baseUrlSB}/building/openarea/?building_id=${ev}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.openAreas = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }

  onSelectBuilding(ev: any) {
    this.deviceFilters.building = ev;
    this.buildingFilters.building = ev;
    this.alertFilterForm.get('area_type').reset();
    this.alertFilterForm.get('floor').reset();
    this.alertFilterForm.get('space').reset();
    this.alertFilterForm.get('room').reset();
    this.alertFilterForm.get('open_area').reset();
    if (!!ev) {
      this.getBuildingFloors(ev);
      this.getCustomerDevice(this.buildingFilters);
    }
  }

  getCustomerDevice(filters: any) {
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.devices = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }

  onSelectAlert(ev: any) {
    let idx = this.alertTypes.findIndex(ele => {
      return ele.id === ev;
    });
    if (idx != -1) {
      this.buildingFilters.device_type = this.alertTypes[idx].device_type;
      this.alertFilterForm.get('device').setValue(null);
      this.getCustomerDevice(this.buildingFilters);
      this.onSelectTab(this.alertTypes[idx].tab_name);
    }
  }

  onDeviceSelect(ev?: any) {
    console.log(ev);
  }

  onAreaSelect(ev: any) {
    if (ev === 'floor') {
      this.deviceFilters.open_area = '';
      this.buildingFilters.open_area = '';
      this.alertFilterForm.get('floor').setValue(null);
      if (this.deviceFilters.building) {
        this.getBuildingFloors(this.deviceFilters.building);
      }
    } else {
      this.alertFilterForm.get('open_area').setValue(null);
      this.deviceFilters.floor = '';
      this.deviceFilters.space = '';
      this.deviceFilters.space_attribute = '';
      this.buildingFilters.floor = '';
      this.buildingFilters.space = '';
      this.buildingFilters.space_attribute = '';
      if (this.deviceFilters.building) {
        this.getBuildingOpenAreas(this.deviceFilters.building);
      }
    }
  }

  onSelectFloor(ev: any) {
    this.deviceFilters.floor = ev;
    this.buildingFilters.floor = ev;
    if (!!ev) {
      this.getBuildingSpacesByFloor(ev);
      this.getCustomerDevice(this.buildingFilters);
    }
  }

  onSelectSpace(ev: any) {
    this.deviceFilters.space = ev;
    this.buildingFilters.space = ev;
    if (!!this.deviceFilters.floor && !!ev) {
      this.getRoomsBySpacesByFloor(this.deviceFilters.floor, ev);
      this.getCustomerDevice(this.buildingFilters);
    }
  }

  onSelectRoom(ev: any) {
    this.deviceFilters.space_attribute = ev;
    this.buildingFilters.space_attribute = ev;
    this.getCustomerDevice(this.buildingFilters);
  }

  onSelectOpenArea(ev: any) {
    this.deviceFilters.open_area = ev;
    this.buildingFilters.open_area = ev;
    this.getCustomerDevice(this.buildingFilters);
  }

  onTableSignals(ev: any) {
    // console.log(ev);
    if (ev.type === 'onEdit') {
      this.onAddAlert(ev.row);
    } else if (ev.type === 'onDelete') {
      this.onDeleteAlert(ev.row);
    }
    else if (ev.type === "somokeDetail") {
      this.router.navigate(['/ss/smart-alarm/smoke-detail', ev.row['device_id']]);
      // this.dss.shareData(ev.row);
    }
    else if (ev.type === "waterleakageDetail") {
      this.router.navigate(['/ss/smart-alarm/water-leakage-detail', ev.row['device_id']]);
      // this.dss.shareData(ev.row);
    }
    else if (ev.type === "temperatureDetail") {
      this.router.navigate(['/ss/temperature/temperature-detail', ev.row['device_id']]);
      // this.dss.shareData(ev.row);
    }
  }

  onSelectTab(ev: any) {
    this.active = ev;
    if (ev === 'smoke') {
      this.smokeFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'Smoke Alarm', search: '', customer_id: this.customerId };
    } else if (ev === 'water-leakage') {
      this.waterLeakageFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'Water Leakage Sensor', search: '', customer_id: this.customerId };
    } else if (ev === 'occupancy') {
      this.occupancyFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'Occupancy', search: '', customer_id: this.customerId };
    } else if (ev === 'temperature') {
      this.temperatureFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'Temperature', search: '', customer_id: this.customerId };
    } else if (ev === 'humidity') {
      this.humidityFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'Humidity', search: '', customer_id: this.customerId };
    } else if (ev === 'geozone') {
      this.geozoneFilters = { limit: 10, offset: '0', order_by: '', order: '', alert_type: 'geozone', search: '', customer_id: this.customerId };
    }

    setTimeout(() => {
      this.actions.next({ action: 'reload' });
    }, 100);
  }

  onSubmit() {
    const formData = this.alertFilterForm.value;
    // this.actions.next({action: 'reload'});
    this.onFilterSignals(formData);
  }

  onFilterSignals(ev: any) {
    if (!!ev.device && ev.device !== '') {
      switch (this.active) {
        case 'smoke':
          this.smokeFilters.device_id = ev.device;
          this.actions.next({ action: 'reload' });
          break;
        case 'water-leakage':
          this.waterLeakageFilters.device_id = ev.device;
          this.actions.next({ action: 'reload' });
          break;
        case 'occupancy':
          this.occupancyFilters.device_id = ev.device;
          this.actions.next({ action: 'reload' });
          break;
        case 'temperature':
          this.temperatureFilters.device_id = ev.device;
          this.actions.next({ action: 'reload' });
          break;
        case 'geozone':
          this.geozoneFilters.device_id = ev.device;
          this.actions.next({ action: 'reload' });
          break;
        case 'humidity':
          this.humidityFilters.device_id = ev.device;
          this.actions.next({ action: 'reload' });
          break;
        default:
          break;
      }
    }
  }

  onAddAlert(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(AlertFormComponent, options);

    if (ev) {
      dialogRef.componentInstance.data = ev;
      dialogRef.componentInstance.title = 'Edit Alerts';

    }
    dialogRef.closed.subscribe((val: any) => {
      this.actions.next({ action: 'reload' });
    });
  }

  onDeleteAlert(ev: any) {
    AlertService.confirm('Are you sure?', 'You want to delete this alert?', 'Yes', 'No').subscribe((resp: VAlertAction) => {
      if (resp.positive) {
        this.actions.next({ action: 'loadingTrue' });
        const slug = `${environment.baseUrlNotif}/alert/?id=${ev.id}&device_id=${ev.device_id}`;
        this.apiService.delete(slug).subscribe((resp: any) => {
          this.actions.next({ action: 'reload' });
        }, (err: any) => {
          this.actions.next({ action: 'loadingFalse' });
        });
      } else {
        return;
      }
    })
  }

  onReset() {
    this.actions.next({ type: 'reset' });
    this.alertFilterForm.reset();
    this.alertFilterForm.get('alert_type').setValue('Smoke Alarm');
    this.buildingFilters = { device_type: 'Smoke Alarm', customer_id: this.customerId, device: '' };
    this.getCustomerDevice(this.buildingFilters);

    setTimeout(() => {
      // switch (this.active) {
      //   case 'smoke':
      //     break;
      //     case 'water-leakage':
      //     this.waterLeakageFilters = { limit: 10, offset: '0', alert_type: 'Water Leakage Sensor' };
      //     this.actions.next({ action: 'reload' });
      //     break;
      //     case 'occupancy':
      //       this.occupancyFilters = { limit: 10, offset: '0', alert_type: 'occupancy' };
      //       this.actions.next({ action: 'reload' });
      //     break;
      //   case 'temperature':
      //     this.temperatureFilters = { limit: 10, offset: '0', alert_type: 'temperature' };
      //     this.actions.next({ action: 'reload' });
      //     break;
      //   case 'humidity':
      //     this.humidityFilters = { limit: 10, offset: '0', alert_type: 'humidity' };
      //     this.actions.next({ action: 'reload' });
      //     break;
      //   default:
      //     break;
      // }
      this.smokeFilters = { limit: 10, offset: '0', alert_type: 'Smoke Alarm' };
      this.onSelectTab('smoke');
    }, 200);
  }
}
