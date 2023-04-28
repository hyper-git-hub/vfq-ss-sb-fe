import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-alert-form',
  templateUrl: './alert-form.component.html',
  styleUrls: ['./alert-form.component.scss']
})
export class AlertFormComponent implements OnInit {
  loading: boolean;  
  enableThreshold: boolean;  
  title: string;

  deviceTypes: any[] = [];
  devices: any[] = [];
  alertType: any[] = [];
  buildings: any[] = [];
  areaTypes: any[] = [];
  floors: any[] = [];
  spaces: any[] = [];
  rooms: any[] = [];
  openAreas: any[] = [];

  data: any;
  user: any;
  customerId: any;
  deviceid: any
  deviceFilters: any;
  buildingFilters: any;

  alertForm: FormGroup;

  constructor(
    private modalRef: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private apiService: ApiService
  ) {
    this.loading = false;
    this.enableThreshold = false;
    this.title = 'Add Alert';
    
    this.data = null;
    let u: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = u.customer['customer_id'];
    this.deviceFilters = { device: '', building: '', space: '', space_attribute: '', open_area: '', export: '' };
    this.buildingFilters = { device_type: 'smoke', customer_id: this.customerId, device: '', building: '', space: '', space_attribute: '', open_area: '', export: '' };

    this.alertForm = this.formBuilder.group({
      alert_type: ['Smoke Alarm', [Validators.required]],
      device_type: [null],
      device: [null, [Validators.required]],
      building: [null],
      area_type: [null],
      floor: [null],
      space: [null],
      room: [null],
      open_area: [null],
      alert_name: [null, [Validators.required]],
      packet_key: [null, [Validators.required]],
      lower_threshold: [null],
      upper_threshold: [null],
      alert_body: [null]
    });

    this.deviceTypes= [
      { id: 1, name: 'Energy Meter' },
      { id: 2, name: 'Socket' },
      { id: 3, name: 'Bulb' },
      { id: 4, name: 'Water Meter' }
    ];

    this.devices = [];

    this.alertType = [
      { id: 'Smoke Alarm', name: 'Smoke', packet_key: 'fire_status', device_type: 'smoke' },
      { id: 'Water Leakage Sensor', name: 'Water Leakage', packet_key: 'leakage_status', device_type: 'Water Leakage Sensor' },
      { id: 'Occupancy', name: 'Occupancy', packet_key: 'occupancy', device_type: 'camera' },
      { id: 'Temperature', name: 'Temperature', packet_key: 'temp', device_type: 'temperature' },
      { id: 'Humidity', name: 'Humidity', packet_key: 'hum', device_type: 'temperature' },
      // { id: 'Geo Zone', name: 'Geo zone', packet_key: 'geozone' },
      // { id: 'Energy Meter', name: 'Energy Meter' },
      // { id: 'Camera', name: 'Camera' },
    ];

    this.buildings= [];
    this.areaTypes = [
      { id: 'floor', name: 'Floor' },
      { id: 'open_area', name: 'Open Area' },
    ];
    this.floors= [];
    this.spaces= [];
    this.rooms= [];
    this.openAreas= [];
  }

  ngOnInit(): void {
    if(this.data){
      let idx = this.alertType.findIndex(ele => {
        return ele.id == this.data.alert_type;
      })
      if (idx != -1) {
        this.buildingFilters.device_type = this.alertType[idx].device_type;
      }

      let at = this.data.alert_type;
      if (at != 'Smoke Alarm' && at != 'Water Leakage Sensor') {
        this.setValidator(true);
      } else {
        this.setValidator(false);
      }
      this.getCustomerDeviceBuilding(this.buildingFilters);  
      this.alertForm.patchValue(this.data);

    } else {
      this.getBuildingList();
      this.getCustomerDevice(this.buildingFilters);
      this.alertForm.get('packet_key').setValue('fire_status');
      this.alertForm.get('alert_type').valueChanges.subscribe((val) => {
        if (val === 'Occupancy' || val === 'Temperature' || val === 'Humidity') {
          this.setValidator(true);
        } else {
          this.setValidator(false);
        }
      });

      this.alertForm.valueChanges.subscribe(() => {
        console.log(this.alertForm.controls);
      })
    }
  }

  setValidator(enable: boolean) {
    if (enable) {
      this.enableThreshold = true;
      this.alertForm.get('lower_threshold').setValidators(Validators.required);
      this.alertForm.get('upper_threshold').setValidators(Validators.required);
    } else {
      this.enableThreshold = false;
      this.alertForm.get('lower_threshold').removeValidators(Validators.required);
      this.alertForm.get('upper_threshold').removeValidators(Validators.required);
      this.alertForm.get('lower_threshold').setValue(null);
      this.alertForm.get('upper_threshold').setValue(null);
    }
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
    const slug = `${environment.baseUrlSB}/building/spacename/?floor_id=${ev}`;
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
    this.buildingFilters.floor = '';
    this.buildingFilters.space = '';
    this.buildingFilters.space_attribute = '';
    this.buildingFilters.open_area = '';
    this.alertForm.get('floor').reset();
    this.alertForm.get('area_type').reset();
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

  getCustomerDeviceBuilding(filters: any) {
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/?device=${this.data.device_id}`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.devices = resp.data['data'][0];
      if (this.devices) {
        this.alertForm.patchValue({
          building : this.devices['building_name'],
          floor : this.devices['floor_name'],
          open_area : this.devices['open_area_name'],
          space : this.devices['space_name'],
          room : this.devices['space_attribute_name'],
          device : this.devices['device'],

        });
      }
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }

  onSelectAlert(ev: any) {
    let idx = this.alertType.findIndex(ele => {
      return ele.id === ev;
    });
    if (idx != -1) {
      this.buildingFilters.device_type = this.alertType[idx].device_type;
      this.alertForm.get('packet_key')?.setValue(this.alertType[idx].packet_key);
      this.alertForm.get('device').setValue(null);
      this.getCustomerDevice(this.buildingFilters);
    }

    if (ev != 'Smoke Alarm' && ev != 'Water Leakage Sensor' && ev != 'Geo Zone') {
      this.enableThreshold = true;
      this.alertForm.get('lower_threshold').setValidators(Validators.required);
      this.alertForm.get('upper_threshold').setValidators(Validators.required);
    } else {
      this.enableThreshold = false;
      this.alertForm.get('lower_threshold').removeValidators(Validators.required);
      this.alertForm.get('upper_threshold').removeValidators(Validators.required);
    }
  }

  onDeviceSelect(ev: any) {
    console.log(ev);    
  }

  onAreaSelect(ev: any) {
    if (ev === 'floor') {
      this.deviceFilters.open_area = '';
      this.buildingFilters.open_area = '';
      this.alertForm.get('floor').setValue(null);
      if (this.deviceFilters.building) {
        this.getBuildingFloors(this.deviceFilters.building);
      }
    } else {
      this.alertForm.get('open_area').setValue(null);
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
    this.alertForm.get('device').setValue(null);
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

  onSubmit() {
    if (!this.alertForm.valid) {
      return;
    }
    this.loading = true;
    const formData = this.alertForm.value;
    let slug = `${environment.baseUrlNotif}/alert/`;

    let payload = {
      alert_name: formData.alert_name,
      device_id: formData.device,
      packet_key: formData.packet_key,
      lower_threshold: formData.lower_threshold,
      upper_threshold: formData.upper_threshold,
      alert_body: formData.alert_body,
      alert_type: formData.alert_type,
    }

    if (this.data) {
      slug = `${environment.baseUrlNotif}/alert/?id=${this.data?.id}`;
      this.updateAlert(slug, payload);
    } else {
      this.createAlert(slug, payload);
    }
  }
  
  createAlert(slug: string, payload: any) {
    this.loading = true;
    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.toastr.success("Alert created successfully");
      this.onCloseModel();
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message']);
    });
  }

  updateAlert(slug: string, payload: any) {
    this.loading = true;
    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      this.toastr.success("Alert updated successfully");
      this.onCloseModel();
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message']);
    });
  }

  onCloseModel() {
    this.modalRef.close();
  }
}
