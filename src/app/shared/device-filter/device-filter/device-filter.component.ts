import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-filter',
  templateUrl: './device-filter.component.html',
  styleUrls: ['./device-filter.component.scss']
})
export class DeviceFilterComponent implements OnInit {

  @Input() showReset: boolean;
  @Input() showFieldset: boolean;
  @Input() showDevices: boolean;
  @Input() showDeviceTypes: boolean;
  @Input() showBuildingTypes: boolean;
  @Input() deviceTypeClearable: boolean;
  @Input() deviceRequired: boolean;
  @Input() selectDT: boolean;
  @Input() doCallDevices: boolean;

  @Input() defaultType: string;
  @Input() deviceType: string;
  @Input() defaultDevice: string;

  @Input() deviceTypes: any[];
  @Input() actions: Subject<any>;

  buildings: any[];
  buildingTypes: any[];
  areas: any[];
  floors: any[];
  spaces: any[];
  rooms: any[];
  openAreas: any[];
  devices: any[];

  deviceFilters: any;

  filterForm: FormGroup;
  @Output() signals: EventEmitter<any>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.showReset = true;
    this.showFieldset = true;
    this.showDevices = false;
    this.deviceTypeClearable = false;
    this.deviceRequired = false;
    this.showDeviceTypes = false;
    this.showBuildingTypes = false;
    this.selectDT = false;
    this.doCallDevices = true;

    this.buildingTypes = [];
    this.buildings = [];
    this.areas = [{ id: 'floor', name: 'By Floor' }, { id: 'openArea', name: 'By Open Area' }];
    this.floors = [];
    this.spaces = [];
    this.rooms = [];
    this.openAreas = [];
    this.devices = [];
    this.deviceTypes = [];

    this.deviceFilters = { building: '', floor: '', space: '', space_attribute: '', open_area: '' };

    this.filterForm = new FormGroup({
      building_type: new FormControl(null),
      building: new FormControl(null),
      area: new FormControl(null),
      floor: new FormControl(null),
      space: new FormControl(null),
      room: new FormControl(null),
      open_area: new FormControl(null),
      device: new FormControl(null),
      device_type: new FormControl(null),
    });
    this.signals = new EventEmitter();

    this._unsubscribeAll = new Subject();
    this.actions = new Subject();
    this.deviceType = '';
    this.defaultDevice = '';
  }

  ngOnInit(): void {
    if (this.selectDT) {
      this.deviceFilters.device_type = this.defaultType;
      this.filterForm.controls['device_type'].setValue(this.defaultType);
    }
    if (!!this.defaultDevice) {
      this.filterForm.controls['device'].setValue(this.defaultDevice);
      this.deviceFilters.device = this.defaultDevice;
    }
    this.getBuildingList();
    if (this.doCallDevices) {
      this.getDevices(this.deviceFilters);
    }
    this.signals.emit(this.deviceFilters);

    if (!!this.actions) {
      this.actions.pipe(takeUntil(this._unsubscribeAll)).subscribe((e: any) => {
        this.handleFilterAction(e);
      });
    }

    if (this.deviceRequired) {
      this.filterForm.get('device').setValidators([Validators.required]);
    }

    this.filterForm.get('device_type').valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((val: any) => {
      this.onSelectDeviceType(val);
    })
  }

  onSelectDeviceType(ev: any) {
    this.deviceFilters.device_type = ev;
    this.deviceFilters.device = '';
    this.filterForm.controls['device'].setValue(null);
    this.getDevices(this.deviceFilters);
    this.signals.emit(this.deviceFilters);
  }

  onSelectBuildingType(ev: any) {
    this.deviceFilters.building_type = ev;
    this.deviceFilters.building = '';
    this.getBuildingList(ev);
    this.signals.emit(this.deviceFilters);
  }

  onSelectDevice(ev: any) {
    this.deviceFilters.device = ev;
    let dt = this.devices.find(ele => {
      return ele.device = ev;
    });
    if (!!dt) {
      this.deviceFilters.device_name = dt.device_name;
    } else {
      this.deviceFilters.device_name = '';
    }
    this.signals.emit(this.deviceFilters);
  }

  onSelectBuilding(ev: any) {
    this.deviceFilters.building = ev;
    if (!!ev) {
      this.filterForm.controls['floor'].reset();
      this.filterForm.controls['area'].reset();
      this.filterForm.controls['space'].reset();
      this.filterForm.controls['room'].reset();
      this.filterForm.controls['open_area'].reset();
      this.filterForm.controls['device'].reset();
      this.floors = [];
      this.spaces = [];
      this.rooms = [];
      this.openAreas = [];
      this.devices = [];
      this.getBuildingFloors(ev);
      this.getDevices(this.deviceFilters);
    }
    this.signals.emit(this.deviceFilters);
  }

  onAreaSelect(ev: any) {
    if (ev === 'floor') {
      this.deviceFilters.open_area = '';
      this.filterForm.get('floor').setValue(null);
      if (this.deviceFilters.building) {
        this.getBuildingFloors(this.deviceFilters.building);
        this.getDevices(this.deviceFilters);
      }
    } else {
      this.filterForm.get('open_area').setValue(null);
      this.deviceFilters.floor = '';
      this.deviceFilters.space = '';
      this.deviceFilters.space_attribute = '';
      if (this.deviceFilters.building) {
        this.getBuildingOpenAreas(this.deviceFilters.building);
        this.getDevices(this.deviceFilters);
      }
    }
  }

  onSelectFloor(ev: any) {
    this.deviceFilters.floor = ev;
    if (!!ev) {
      this.filterForm.controls['space'].reset();
      this.filterForm.controls['room'].reset();
      this.filterForm.controls['open_area'].reset();
      this.filterForm.controls['device'].reset();

      this.spaces = [];
      this.rooms = [];
      this.openAreas = [];
      this.devices = [];
      this.getBuildingSpacesByFloor(ev);
      this.getDevices(this.deviceFilters);
    }
    this.signals.emit(this.deviceFilters);
  }

  onSelectSpace(ev: any) {
    this.deviceFilters.space = ev;
    if (!!this.deviceFilters.floor && !!ev) {
      this.filterForm.get('device').reset();
      this.devices = [];
      this.getRoomsBySpacesByFloor(this.deviceFilters.floor, ev);
      this.getDevices(this.deviceFilters);
    }
    this.signals.emit(this.deviceFilters);
  }

  onSelectRoom(ev: any) {
    this.deviceFilters.space_attribute = ev;
    this.filterForm.get('device').reset();
    this.devices = [];
    this.getDevices(this.deviceFilters);
    this.signals.emit(this.deviceFilters);
  }

  onSelectOpenArea(ev: any) {
    this.deviceFilters.open_area = ev;
    this.getDevices(this.deviceFilters);
    this.signals.emit(this.deviceFilters);
  }

  getBuildingList(buildingType?: any) {
    let slug = `${environment.baseUrlSB}/building/`;
    if (this.showBuildingTypes && !!buildingType) {
      slug = `${environment.baseUrlSB}/building/?building=${buildingType}`;
    }
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

  getDevices(ev: any) {
    if (this.showDevices) {
      let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
      for (const key in ev) {
        if (key != 'device_name') {
          if (!!ev[key]) {
            url.searchParams.set(key, ev[key]);
          }
        }
      }

      this.apiService.get(url.href).subscribe((resp: any) => {
        this.devices = resp.data['data'];
      }, (err: any) => {
        this.toastr.error(err.error['message']);
      });
    } else {
      return;
    }
  }

  onResetFilters() {
    this.filterForm.reset();
    setTimeout(() => {
      this.deviceFilters = { building: '', space: '', floor: '', space_attribute: '', open_area: '', device_type: this.deviceType };
      this.signals.emit({type: 'reset', filters: this.deviceFilters});
    }, 100);
  }

  submit() {
    let body: any = []
    body = this.deviceFilters
    console.log("body ", body)
    let data: any = []
    data = this.filterForm.value
    console.log("data ", data)
  }

  handleFilterAction(ev: any) {
    switch (ev.type) {
      case 'reset':
        this.filterForm.reset();
        this.deviceFilters = { building: '', space: '', floor: '', space_attribute: '', open_area: '' };
        // this.signals.emit({type: 'reset', filters: this.deviceFilters});
        break;
      case 'submit':
        this.submit();
        break;
      default:
        break;
    }
  }
}
