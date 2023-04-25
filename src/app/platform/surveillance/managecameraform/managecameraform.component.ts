import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment, ports } from 'src/environments/environment';
import { UserserviceService } from 'src/app/core/services/userservice.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-managecameraform',
    templateUrl: './managecameraform.component.html',
    styleUrls: ['./managecameraform.component.scss']
})
export class ManagecameraformComponent implements OnInit {

    submitted: boolean;
    loading: boolean;
    requestOccupancy: boolean;
    requestMotion: boolean;
    edgeDevice: boolean;
    ErrorCheckd: boolean;

    title: string;
    errorMessages: string[];

    buildings: any[];
    areas: any[];
    floors: any[];
    spaces: any[];
    rooms: any[];
    openAreas: any[];
    days: any[] = [];
    selectedDays: any[] = [];

    data: any;
    user: any;
    urlPort = ports;

    checkEdgeDevice: any;
    customerid: any;
    deviceid: any;
    buildingFilters: any;

    cameraForm: FormGroup;

    constructor(
        private modalRef: NgbActiveModal,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private apiService: ApiService,
        private authService: AuthService
    ) {
        this.ErrorCheckd = false;
        this.requestOccupancy = false;
        this.requestMotion = false;
        //when Add button is click
        this.data = null;
        this.title = 'Add Camera';
        this.user = this.authService.getUser();
        this.customerid = this.user.customer.customer_id;

        this.days = [
            { id: 0, value: 0, name: 'Monday', select: false, allSelect: false },
            { id: 1, value: 1, name: 'Tuesday', select: false, allSelect: false },
            { id: 2, value: 2, name: 'Wednesday', select: false, allSelect: false },
            { id: 3, value: 3, name: 'Thursday', select: false, allSelect: false },
            { id: 4, value: 4, name: 'Friday', select: false, allSelect: false },
            { id: 5, value: 5, name: 'Saturday', select: false, allSelect: false },
            { id: 6, value: 6, name: 'Sunday', select: false, allSelect: false },
        ];
        this.buildings = [];
        this.areas = [{ id: 'floor', name: 'By Floor' }, { id: 'openArea', name: 'By Open Area' }];
        this.floors = [];
        this.spaces = [];
        this.rooms = [];
        this.openAreas = [];

        this.buildingFilters = { building: '', area: '', floor: '', space: '', space_attribute: '', open_area: '' };

        this.cameraForm = this.formBuilder.group({
            camera_name: [null, [Validators.required, Validators.maxLength(60)]],
            camera_id: [null, [Validators.required, Validators.maxLength(60)]],
            building: [null, [Validators.required]],
            area: [null],
            floor: [null],
            space: [null],
            room: [null],
            open_area: [null],
            motion: [false],
            overflow: [null],
            underflow: [null],
            occupancy: [false],
            start_time: [null],
            end_time: [null],
            repeat: [false],
        });
    }

    ngOnInit(): void {
        this.getBuildings();
        if (this.data) {
            this.onEditModal();
            const dt = this.data;
            if (!!dt.open_area) {
                this.cameraForm.get('area').setValue('open_area');
                this.getBuildingOpenAreas(dt.building);
            } else {
                this.cameraForm.get('area').setValue('floor');
                this.getBuildingFloors(dt.building);
            }
        }

        this.cameraForm?.controls['repeat'].valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((val: any) => {
            this.selectAllDays(val);
        });

        this.cameraForm.get('motion').valueChanges.subscribe((val) => {
            if (val) {
                this.requestMotion = true;
                this.cameraForm.get('start_time').setValidators(Validators.required);
                this.cameraForm.get('end_time').setValidators(Validators.required);
                this.selectedDays.length === 0;
            } else {
                this.requestMotion = false;
                this.cameraForm.get('start_time').removeValidators(Validators.required);
                this.cameraForm.get('end_time').removeValidators(Validators.required);
            }
        });

        this.cameraForm.get('occupancy').valueChanges.subscribe((val) => {
            if (val) {
                this.requestOccupancy = true;
                this.cameraForm.get('overflow').setValidators(Validators.required);
                this.cameraForm.get('underflow').setValidators(Validators.required);
            } else {
                this.requestOccupancy = false;
                this.cameraForm.get('overflow').removeValidators(Validators.required);
                this.cameraForm.get('underflow').removeValidators(Validators.required);
            }
        });

        this.cameraForm.valueChanges.subscribe(() => {
            console.log(this.cameraForm.controls);
        })
    }

    onEditModal() {
        this.cameraForm.patchValue({
            camera_name: this.data.device_name,
            camera_id: this.data.device,
            building: this.data.building,
            overflow: this.data.overflow,
            underflow: this.data.underflow,
            start_time: this.data.start_time.split('.')[0],
            end_time: this.data.end_time.split('.')[0],
            motion: this.data.motion,
            occupancy: this.data.occupancy,
            days: this.data.days,
        });

        // setTimeout(() => {
        //     const startTime = document.getElementById('startTime');
        //     const endTime = document.getElementById('endTime');
        //     startTime['value'] =  this.data.start_time.split(".")[0];
        //     endTime['value'] =  this.data.end_time.split(".")[0];
        // }, 500);
        let dt = this.data['days'];
        if (!!dt) {
            dt = dt.split(',');
            this.days.forEach(ele => {
                dt.forEach(st => {
                    if (ele.id === +st) {
                        ele.select = true;
                        this.onSelectDay(ele);
                    }
                });
            });
        }
        this.requestMotion = this.data.motion;
        this.requestOccupancy = this.data.occupancy;
    }

    getBuildings(buildingType?: any) {
        let slug = `${environment.baseUrlSB}/building/`;
        // if (this.showBuildingTypes && !!buildingType) {
        //   slug = `${environment.baseUrlSB}/building/?building=${buildingType}`;
        // }
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

            if (this.data && this.data.floor) {
                this.cameraForm.get('floor').setValue(this.data.floor);
                this.getBuildingSpacesByFloor(this.data.floor);
            }
        }, (err: any) => {
            this.toastr.error(err.error['message']);
        });
    }

    getBuildingSpacesByFloor(ev: any) {
        const slug = `${environment.baseUrlSB}/building/space/?floor_id=${ev}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.spaces = resp.data['data'];

            const dt = this.data;
            if (dt && dt.space) {
                this.cameraForm.get('space').setValue(dt.space);
                this.getRoomsBySpacesByFloor(dt.floor, dt.space);
            }
        }, (err: any) => {
            this.toastr.error(err.error['message']);
        });
    }

    getRoomsBySpacesByFloor(fId: any, sId: any) {
        const slug = `${environment.baseUrlSB}/building/space/attribute/?floor_id=${fId}&space_id=${sId}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.rooms = resp.data['data'];

            const dt = this.data;
            if (dt && dt.space_attribute) {
                this.cameraForm.get('space_attribute').setValue(dt.space_attribute);
            }
        }, (err: any) => {
            this.toastr.error(err.error['message']);
        });
    }

    getBuildingOpenAreas(ev: any) {
        const slug = `${environment.baseUrlSB}/building/openarea/?building_id=${ev}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.openAreas = resp.data['data'];

            if (this.data.open_area) {
                this.cameraForm.get('open_area').setValue(this.data.open_area);
            }
        }, (err: any) => {
            this.toastr.error(err.error['message']);
        });
    }

    onSelectBuilding(ev: any) {
        if (!!ev) {
            this.floors = [];
            this.spaces = [];
            this.rooms = [];
            this.openAreas = [];
            this.cameraForm.controls['floor'].setValue(null);
            this.cameraForm.controls['area'].setValue(null);
            this.cameraForm.controls['space'].setValue(null);
            this.cameraForm.controls['room'].setValue(null);
            this.cameraForm.controls['open_area'].setValue(null);
            this.buildingFilters.building = ev;
            this.getBuildingFloors(ev);
        }
    }

    onAreaSelect(ev: any) {
        if (ev === 'floor') {
            this.cameraForm.get('floor').setValue(null);
            if (this.buildingFilters.building) {
                this.getBuildingFloors(this.buildingFilters.building);
            }
        } else {
            this.cameraForm.get('open_area').setValue(null);
            this.buildingFilters.floor = '';
            this.buildingFilters.space = '';
            this.buildingFilters.space_attribute = '';
            if (this.buildingFilters.building) {
                this.getBuildingOpenAreas(this.buildingFilters.building);
            }
        }
    }

    onSelectFloor(ev: any) {
        this.buildingFilters.floor = ev;
        if (!!ev) {
            this.cameraForm.controls['space'].reset();
            this.cameraForm.controls['room'].reset();
            this.cameraForm.controls['open_area'].reset();

            this.spaces = [];
            this.rooms = [];
            this.openAreas = [];
            this.getBuildingSpacesByFloor(ev);
        }
    }

    onSelectSpace(ev: any) {
        this.buildingFilters.space = ev;
        if (!!this.buildingFilters.floor && !!ev) {
            this.getRoomsBySpacesByFloor(this.buildingFilters.floor, ev);
        }
    }

    onSelectRoom(ev: any) {
        this.buildingFilters.space_attribute = ev;
    }

    onSelectOpenArea(ev: any) {
        this.buildingFilters.open_area = ev;
    }

    onFilterSignals(ev: any) {
        // console.log(ev);
    }

    onSubmit() {
        if (this.cameraForm.invalid) {
            return;
        }
        this.loading = false;
        const formData = this.cameraForm.value;
        this.verifyDevice(formData);

        // let slug = `${environment.baseUrlSB}/building/smart_devices`;
        // let payload: any = {
        //     overflow: formData.overflow,
        //     underflow: formData.underflow,
        //     start_time: formData.start_time + ':00',
        //     end_time: formData.end_time + ':00',
        //     motion: formData.motion,
        //     occupancy: formData.occupancy,
        //     // repeat: formData.repeat,
        //     days: this.selectedDays.join(),
        //     device: this.data.device,
        // };
        // console.log(formData);

        // if (this.data) {
        //     slug = `${environment.baseUrlSB}/building/smart_devices/`
        //     this.updateSchedule(slug, payload);
        //     console.log(formData)
        // } else {
        //     console.log(formData)
        //     this.createSchedule(slug, payload);
        // }
    }

    verifyDevice(formData: any) {
        let devUrl = `${environment.cobInventory}/inventory/mobile/sb-allocate-device?customer_id=${this.customerid}&device_id=${formData.camera_id}`;
        this.apiService.get(devUrl).subscribe((resp: any) => {
            const dt = resp.data;
            if (dt.device_type === 'Camera') {
                this.configureCamera(formData);
            } else {
                this.toastr.error('Device is not camera device');
                this.loading = false;
            }
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error['message']);
        });
    }

    configureCamera(formData: any) {
        const url = `${environment.baseUrlDevice}/api/device`;
        let payload = {
            device_name: formData.camera_name,
            is_traceable : true,
            device_id : formData.camera_id
        }

        this.apiService.post(url, payload).subscribe((resp: any) => {
            this.associateDev2Building(formData);
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error['message']);
        });
    }

    associateDev2Building(formData: any) {
        const slug = `${environment.baseUrlSB}/building/smart_devices/`;
        let payload = {
            device: formData.camera_id,
            device_type: 'Camera',
            building: formData.building,
            floor: null, space: null,
            space_attribute: null, open_area: null,
            days: this.selectedDays.join(),
            overflow: formData.overflow,
            underflow: formData.underflow,
            start_time: formData.start_time + ':00',
            end_time: formData.end_time + ':00',
            motion: formData.motion,
            occupancy: formData.occupancy,
            repeat: formData.repeat,
        }

        if (formData.area === 'floor') {
            payload.floor = formData.floor,
            payload.space = formData.space,
            payload.space_attribute = formData.space_attribute
        } else {
            payload.open_area = formData.open_area
        }

        if (this.data && this.data.id) {
            payload['id'] = this.data.id;
            this.apiService.patch(slug, payload).subscribe((resp: any) => {
                this.modalRef.close();
                this.loading = false;
            }, (err: any) => {
                this.loading = false;
                this.toastr.error(err.error['message']);
            });
        } else {
            this.apiService.post(slug, payload).subscribe((resp: any) => {
                this.modalRef.close();
                this.loading = false;
            }, (err: any) => {
                this.loading = false;
                this.toastr.error(err.error['message']);
            });
        }
    }

    createSchedule(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: any) => {
            this.toastr.success(resp.message);
            // this.loading = false;
            this.modalRef.close();
        }, (err: any) => {
            this.toastr.error(err.error.message);
            // this.loading = false;
            this.modalRef.close();
            // this.loading = false;
        });
    }

    updateSchedule(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: any) => {
            this.toastr.success("Record updated successfully");
            // this.loading = false;
            this.modalRef.close();
        }, (err: any) => {
            // this.loading = false;
            this.toastr.error(err.error.message);
        });
    }

    onCheckOccupancy(event) {
        if (event.target.checked === true) {
            this.requestOccupancy = true;
        } else {
            this.requestOccupancy = false;
        }
    }

    onCheckMD(event) {
        if (event.target.checked === true) {
            this.requestMotion = true;

            this.cameraForm.get('start_time').addValidators(Validators.required);
            this.cameraForm.get('end_time').addValidators(Validators.required);
        } else {
            this.requestMotion = false;
            this.cameraForm.get('start_time').removeValidators(Validators.required);
            this.cameraForm.get('end_time').removeValidators(Validators.required);
        }
    }

    selectAllDays(checked: boolean) {
        if (checked) {
            this.days.forEach(ele => {
                ele.select = true;
                // this.onSelectDay(ele.select);
                this.selectedDays.push(ele.value);
            })
        } else {
            this.days.forEach(ele => {
                ele.select = false;
            })
            this.selectedDays = [];
        }
    }

    onSelectDay(ev: any) {
        if (ev.select) {
            this.selectedDays.push(ev.value);
        } else {
            const idx = this.selectedDays.findIndex(ele => ele === ev.value);
            if (idx !== -1) {
                this.selectedDays.splice(idx, 1)
            }
        }
    }

    onCloseModel() {
        this.modalRef.close();
    }


}
