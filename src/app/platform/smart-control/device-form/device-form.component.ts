import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent implements OnInit {
  loading: boolean;
  title: string;
  data: any;
  deviceFilters: any;

  buildings: any[];
  floors: any[];
  spaces: any[];
  rooms: any[];
  roomspatch: any[];
  openAreas: any[];
  booleanFloorOpen: any
  @Input() areas: any = [];

  deviceForm: FormGroup;

  constructor(
    private modalRef: NgbActiveModal,
    public formBuilder: FormBuilder,
    private dialog: NgbModal,
    private apiService: ApiService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.deviceForm = this.formBuilder.group({
      device_name: [null, [Validators.required]],
      building: new FormControl(null,),
      area: new FormControl(null),
      floor: new FormControl(null),
      space: new FormControl(null),
      room: new FormControl(null),
      open_area: new FormControl(null),
    });

    this.areas = [{ id: 'floor', name: 'By Floor' }, { id: 'openArea', name: 'By Open Area' }];
  }

  ngOnInit(): void {
    this.getBuildingList()

    if (this.data) {
      if (!!this.data.floor_name) {
        this.getBuildingFloors(this.data.building);
        this.getBuildingSpacesByFloor(this.data.floor);
      } else if (!!this.data.open_area) {
        this.getBuildingOpenAreas(this.data.building);
      }

      this.onEditModal();
    }
  }

  onEditModal() {
    this.deviceForm.patchValue({
      device_name: this.data.device_name,
      building: this.data.building,
      area: !!this.data.floor_name ? 'floor' : 'openArea',
      floor: this.data.floor,
      space: this.data.space,
      room: this.data.space_attribute,
      open_area: this.data.open_area,
    });
    this.roomspatch =  this.data.space_attribute_name;
    // this.bulbform.patchValue(this.data);
  }

  getBuildingList() {
    const slug = `${environment.baseUrlSB}/building/`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.buildings = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error getting data for filters');
    });
  }

  onSelectBuilding(ev: any) {
    this.data.building = ev;
    if (!!ev) {
      this.deviceForm.get('area').reset();
      this.deviceForm.get('floor').reset();
      this.deviceForm.get('space').reset();
      this.deviceForm.get('room').reset();
      this.deviceForm.get('open_area').reset();
      this.getBuildingFloors(ev);
      this.getBuildingOpenAreas(ev);
    }
  }

  onAreaSelect(ev: any) {
    if (ev === 'floor') {
      this.booleanFloorOpen = ev;
      // this.filterForm.get('floor').setValue(null);
      this.getBuildingFloors(this.data.building);

    } else {
      this.booleanFloorOpen = ev;
      // this.filterForm.get('open_area').setValue(null);
      this.getBuildingOpenAreas(this.data.building);
    }
  }

  onSelectFloor(ev: any) {
    this.data.floor = ev;
    if (!!ev) {
      console.log("event:", ev)
      this.getBuildingSpacesByFloor(ev);
    }
  }
  onSelectSpace(ev: any) {
    this.data.space = ev;
    console.log(this.data.floor, ev)
    if (!!this.data.floor && !!ev) {
      console.log(this.data.floor, ev)
      this.getRoomsBySpacesByFloor(this.data.floor, ev);
    }
  }

  onSelectRoom(ev: any) {
    this.data.space_attribute = ev;
  }

  getBuildingFloors(ev: any) {
    const slug = `${environment.baseUrlSB}/building/floor/?building_id=${ev}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.floors = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }


  getBuildingOpenAreas(ev: any) {
    console.log("event:", ev)
    const slug = `${environment.baseUrlSB}/building/openarea/?building_id=${ev}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.openAreas = resp.data['data'];
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

  onSubmit() {
    let slug = `${environment.baseUrlSB}/building/smart_devices/?device=${this.data.device}`;
    const formData = this.deviceForm.value;
    // console.log(formData);

    let payload: any = {
      id: this.data.id,
      building: formData.building ? formData.building : this.data.building,
      device: this.data.device,
      floor: null,
      open_area: null,
      space: null,
      space_attribute: null
    }

    if (formData.area === 'openArea') {
      payload['open_area'] = formData.open_area;
    } else {
      payload['floor'] = formData.floor;
      payload['space'] = formData.space ? formData.space : this.data.space;
      payload['space_attribute'] = formData.space_attribute ? formData.space_attribute : this.data.space_attribute;
    }
   
    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      // this.toastr.success("Record updated successfully");
      this.updateDevice(formData.device_name);
      // this.modalRef.close();
    }, (err: any) => {
      this.toastr.error(err.error.message);
    });
  }


  updateDevice(devicename) {
    // console.log(devicename)
    let slug = `${environment.baseUrlDevice}/api/device`;
    let payload: any = {
      device_id: this.data.device,
      device_name: devicename,
    }
    // console.log(payload)
    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      this.toastr.success("Record updated successfully");
      this.modalRef.close();
    }, (err: any) => {
      this.toastr.error(err.error.message);
    });
  }



  onCloseModel() {
    this.modalRef.close();
  }

}
