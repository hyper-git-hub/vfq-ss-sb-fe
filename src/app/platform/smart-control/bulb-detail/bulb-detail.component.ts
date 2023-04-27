import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ShareDataService } from 'src/app/core/services/sharedData.service';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmBoxComponent } from 'src/app/shared/confirm-box/confirm-box.component';
import { FORMATS } from 'src/app/shared/general-table/formats';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';

import { BulbFormComponent } from '../bulb-form/bulb-form.component';
import { bulbDetailTableConfig, SCHEDULEDAYS, STATUS } from './config';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
    selector: 'app-bulb-detail',
    templateUrl: './bulb-detail.component.html',
    styleUrls: ['./bulb-detail.component.scss']
})
export class BulbDetailComponent implements OnInit {

    loading: boolean;
    stateLoading: boolean;
    count: number = 0;

    scheduleListing: any;
    deviceInfo: any;
    buildingDetails: any;
    telematery: any;
    saturaion: any;
    brightnessfinal: any;

    breadCrumbs: any[];
    bulbDetailTableConfig: TableConfig;
    actions: Subject<any> = new Subject();
    turnOffBulb: boolean;
    BulbRGB = new FormControl('#B3B3B3');
    bulbSaturation = new FormControl();
    bulbBrightness = new FormControl();
    colorName: any = null;
    rgbcolor: any;
    filters = { limit: 10, offset: '0', order_by: '', order: '', search: '', export: '', device: '', building: '', floor_id: '', open_area: '' };
    filtersSchedule: any;
    bulbActionPayload: any;
    config: any;

    customerId: number;
    deviceid: any;
    warm: any;
    warmOn: boolean;
    rgbpayload: any
    saturationpayload: any
    brightnesspayload: any
    warmpayload: any
    coolpayload: any
    cool: any;
    coolOn: boolean;
    DeviceDetails: any;
    data: any
    updateSwitch: any;
    updateSwitch1: any;

    constructor(
        private dialog: NgbModal,
        private toastr: ToastrService,
        private dss: ShareDataService,
        private apiService: ApiService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.loading = false;
        this.stateLoading = false;
        this.turnOffBulb = false;
        this.rgbcolor = null;
        this.activatedRoute.paramMap.subscribe(data => {
            this.deviceid = data['params']['id'];
        });

        this.customerId = 0;
        this.breadCrumbs = [
            {
                name: "Smart Control Detail",
                url: "/ss/smart-control/bulb-detail",
                icon: "ri-u-disk-line"
            },
            {
                name: "Bulb",
                url: "",
                icon: ""
            },
        ]
        this.scheduleListing = [];
        this.bulbDetailTableConfig = new TableConfig(bulbDetailTableConfig.config);

        let user: any = JSON.parse(localStorage.getItem('user'));
        this.customerId = user.customer['customer_id'];
        this.filtersSchedule = { limit: 10, offset: '0', order_by: '', order: '', customer_id: this.customerId, device: this.deviceid };

        const rgb = this.hexToRgb('#B3B3B3');
        this.bulbActionPayload = { rgb: '', w1: '1', w2: '1', warm: '212', white: '100' };
        const action = 'setColors';
        let payload = { 'rgbww': `${rgb.r},${rgb.g},${rgb.b},${this.bulbActionPayload.w1},${this.bulbActionPayload.w2}` };
        this.setConfiguration(action, payload);
    }

    ngOnInit(): void {
        this.defineFormats();
        this.dss.getData().subscribe((data: any) => {
            if (!!data) {
                this.data = data;
                this.filters.device = data.device;
                this.filters.building = data.building;
                this.filters.open_area = data.open_area;
            }
        });

        this.getDeviceState();
        this.getBuildingDetails();
        // this.getDeviceTelematery();
        this.getDeviceSchedules(this.filtersSchedule);
        this.BulbRGB.valueChanges.subscribe(value => {
            this.colorName = value;
            this.rgbcolor = this.hexToRgb(value);
            this.bulbActionPayload.rgb = this.rgbcolor;
            const action = 'setColors';
            let payload = { 'rgbww': this.rgbcolor.r + ',' + this.rgbcolor.g + ',' + this.rgbcolor.b + ',' + this.bulbActionPayload.w1 + ',' + this.bulbActionPayload.w2 };
            this.setConfiguration(action, payload);
        });

        this.bulbSaturation.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(val => {
            this.saturation(val);
        });
      
        this.bulbBrightness.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(val => {
            this.brightness(val);
        });
    }

    defineFormats() {
        FORMATS['status'] = STATUS;
        FORMATS['schedule-days'] = SCHEDULEDAYS;
    }

    getDeviceState() {
        this.stateLoading = true;
        const slug = `${environment.baseUrlDevice}/api/device/state?device_id=${this.deviceid}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            const dt = resp.data;
            this.deviceInfo = resp.data;
            if (!!dt) {
                if (dt.current_device_state) {
                    const payload = dt.device_last_configuration['payload'];
                    this.setBulbData(payload);
                } else {
                    this.colorName = '#B3B3B3'
                }
            }
            this.stateLoading = false;
        }, (err: any) => {
            this.stateLoading = false;
            this.toastr.error(err.error['message']);
        });
    }

    setBulbData(dt: any) {
        console.log(dt);
        for (const key in dt) {
          if (key === 'power') {
            this.turnOffBulb = dt['power'] === '1' ? true : false;
        } else if (key === 'rgb') {
            this.coolOn = false;
            this.warmOn = false;
            let rd = dt['rgb'].split(',');
            const hex = this.rgbToHex(rd[0], rd[1], rd[2]);
            this.colorName = hex;
            this.BulbRGB.setValue(hex);
          } else if (key === 'rgbw') {
            this.coolOn = false;
            this.warmOn = false;
            let rd = dt['rgbw'].split(',');
            const hex = this.rgbToHex(rd[0], rd[1], rd[2]);
            this.colorName = hex;
            this.BulbRGB.setValue(hex);
            this.bulbBrightness?.setValue(rd[rd.length - 1]);
        } else if (key === 'rgbww') {
            let rd = dt['rgbww'].split(',');
            this.coolOn = false;
            this.warmOn = false;
            const hex = this.rgbToHex(rd[0], rd[1], rd[2]);
            this.BulbRGB.setValue(hex);
            this.bulbBrightness?.setValue(rd[rd.length - 1]);
            this.bulbSaturation?.setValue(rd[rd.length - 2]);
            this.colorName = hex;
          } else if (key === 'white') {
            this.coolOn = true;
            this.warmOn = false;
            this.colorName = '#F4FDFF';
        } else if (key === 'warm') {
            this.coolOn = false;
            this.warmOn = true;
            this.colorName = '#FCF9D9';
        }
        }
      }

    getBuildingDetails() {
        const slug = `${environment.baseUrlSB}/building/smart_devices/?device=${this.deviceid}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.buildingDetails = resp.data['data'][0];
        }, (err: any) => {
            this.toastr.error(err.error['message']);
        });
    }

    getDeviceTelematery() {
        const slug = `${environment.baseUrlDevice}/api/device/telemetry-data?device=${this.deviceid}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.telematery = resp.data['data'];
            this.count = resp.data.count;
        }, (err: any) => {
            this.toastr.error(err.error['message']);
        });
    }

    getDeviceSchedules(filters: any) {
        this.loading = true;
        let url = new URL(`${environment.baseUrlSB}/building/schedule_devices/`);
        for (const key in filters) {
            if (!!filters[key]) {
                url.searchParams.set(key, filters[key]);
            }
        }
        // const slug = `${environment.baseUrlSB}/building/schedule_devices/?device=${this.deviceid}&search=${filters.search}&limit=${filters.limit}&offset=${filters.offset}`;
        this.apiService.get(url.href).subscribe((resp: any) => {
            this.scheduleListing = resp.data['data'];
            this.count = resp.data.count;
            this.loading = false;
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error['message']);
        });
    }

    onTableSignals(ev: any) {
        // console.log(ev)
        if (ev.type === 'onEdit') {
            this.onAddbulb(ev.row);
        } else if (ev.type === 'onDelete') {
            this.onDelete(ev.row);
        } else if (ev.type === 'onSorting') {
            this.filtersSchedule.order = ev.data['direction'];
            this.filtersSchedule.order_by = ev.data['column'];
            this.getDeviceSchedules(this.filtersSchedule);
        } else if (ev.type === 'onPagination') {
            this.filtersSchedule.limit = ev.data['limit'];
            this.filtersSchedule.offset = ev.data['offset'];
            this.getDeviceSchedules(this.filtersSchedule);
        } else if (ev.type === 'searchTable') {
            this.filtersSchedule.search = ev.data;
            this.getDeviceSchedules(this.filtersSchedule);
        } else if (ev.type === 'onDownload') {
            this.onDownload(this.filtersSchedule, ev.data);
        }
    }

    confirmDelete(ev?: any, cod?: number) {
        // console.log(ev)
        ev.item = ev.device;
        ev.status = ev.status;
        ev.delete = false;
        ev.inactive = false;
        ev.cancel = false;

        if (cod == 1) {
            ev.inactive = true;

        } else {
            ev.delete = true;
        }
        ev.cancel = true;
        const options: NgbModalOptions = { size: 'md', scrollable: true };
        const dialogRef = this.dialog.open(ConfirmBoxComponent, options);

        if (ev) {
            dialogRef.componentInstance.data = ev;
        }

        dialogRef.closed.subscribe((result) => {
            if (result === 1) {
                this.confirmDelete(ev.schedule_id);
            }
        });

    }

    onDelete(ev: any) {
        AlertService.confirm('Are you sure?', 'You want to delete this schedule?', 'Yes', 'No').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.loading = true;
                const slug = `${environment.baseUrlDevice}/api/schedule-task?schedule_id=${ev.schedule_id}`;
                this.apiService.delete(slug).subscribe((resp: any) => {
                    this.loading = false;
                    this.toastr.success(resp.message, 'Successfully deleted', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.getDeviceSchedules(this.filtersSchedule);
                }, (err: any) => {
                    this.loading = false;
                    this.toastr.error(err.error['message'], 'Error', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        })
    }

    saturation(value) {
        this.saturaion = `saturate(${value})`;
        this.bulbActionPayload.w2 = value;
    
        const action = 'setColors';
        let payload = { 'rgbww': `${this.rgbcolor?.r},${this.rgbcolor?.g},${this.rgbcolor?.b},${this.bulbActionPayload.w1},${value}` };
        this.setConfiguration(action, payload);
    }

    // setSaturation() {
    //     let bulb = document.getElementById("bulb");
    //     const saturationcode = document.querySelectorAll('.input10');
    //     let saturaions: any = null;

    //     if (saturationcode.length > 0) {
    //         if (saturationcode[0].id === "saturate") {
    //             saturaions = Number(saturationcode[0]['value']);
    //             // console.log(saturaions)
    //             this.saturaion = `saturate(${saturaions})`;
    //             // console.log(this.saturaion)
    //         }
    //     }

    //     this.bulbActionPayload.w2 = saturaions;
    //     const action = 'setColors';
    //     let payload = { 'rgbww': `${this.rgbcolor.r},${this.rgbcolor.g},${this.rgbcolor.b},${this.bulbActionPayload.w1},${saturaions}` };
    //     this.setConfiguration(action, payload);
    // }

    brightness(value) {
        this.brightnessfinal = `brightness(${value}%)`;
        this.bulbActionPayload.w1 = value;
    
        const action = 'setColors';
        let payload = { 'rgbw': `${this.rgbcolor.r},${this.rgbcolor.g},${this.rgbcolor.b},${value}` };
        this.setConfiguration(action, payload);
    }

    // setBrightness() {
    //     let bulb = document.getElementById("bulb");
    //     const brightnesscode = document.querySelectorAll('.input11');
    //     let brightn: any = null;
    //     if (brightnesscode.length > 0) {
    //         if (brightnesscode[0].id === "bright") {
    //             brightn = Number(brightnesscode[0]['value']);
    //             // console.log(brightn)
    //             this.brightnessfinal = `brightness(${brightn}%)`;
    //             // console.log(this.brightnessfinal)
    //         }
    //     }

    //     this.bulbActionPayload.w1 = brightn;
    //     const action = 'setColors';
    //     let payload = { 'rgbww': `${this.rgbcolor.r},${this.rgbcolor.g},${this.rgbcolor.b},${brightn},${this.bulbActionPayload.w2}` };
    //     this.setConfiguration(action, payload);

    // }

    onAddbulb(ev?: any) {
        const options: NgbModalOptions = { size: 'lg', scrollable: true };
        const dialogRef = this.dialog.open(BulbFormComponent, options);
        dialogRef.componentInstance.deviceId = this.deviceid;

        if (ev) {
            dialogRef.componentInstance.data = ev;
            dialogRef.componentInstance.title = 'Edit schedule';
        }

        dialogRef.closed.subscribe(() => {
            this.getDeviceSchedules(this.filtersSchedule);
        });
    }

    setOnOff(ev: any) {
        const onOff = ev.target['checked'];
        let action = onOff ? 'BulbPowerOn' : 'BulbPowerOff';
        let payload = { "power": onOff ? '1' : '0' };
        this.setConfiguration(action, payload);
        this.postDeviceAction();
    }

    warmLight(event) {
        // console.log(event);
        this.loading = true;
        this.warm = event;
        this.warmOn = !!event ? true: false;
        this.colorName = event === 'WARM_LIGHT' ? '#FCF9D9' : '#fffff';
        const action = 'setColors';
        const payload = { "warm": "212" };
        this.setConfiguration(action, payload);
        this.postDeviceAction();
    }

    whiteLight(event) {
        // console.log(event);
        this.cool = event;
        this.coolOn = !!event ? true : false;
        this.colorName = event === 'WHITE_LIGHT' ? '#F4FDFF' : '#fffff'
        const action = 'setColors';
        const payload = { "white": "100" };
        this.setConfiguration(action, payload);
        this.postDeviceAction();
    }

    setConfiguration(action: string, payload: any) {
        const config: any = {
            action: action,
            payload: payload
        }

        this.config = config;
    }

    postDeviceAction(ev?: any, type?: any) {
        this.loading = true;
        const slug = `${environment.baseUrlDevice}/api/device/action`;
        let payload: any = {
            device_id: this.deviceid,
            configuration: this.config
        }

        this.apiService.post(slug, payload).subscribe((resp: any) => {
            this.turnOffBulb = resp.message.includes('Bulb Powered OFF') ? false : true;
            if (this.turnOffBulb) {
                this.getDeviceState();
            } else {
                this.colorName = '#B3B3B3';
                this.coolOn = false;
                this.warmOn = false;
            }
            this.loading = false;
        }, (err: any) => {
            this.getDeviceState();
            this.turnOffBulb = false;
            // if (this.turnOffBulb) {
            // } else {
            //     this.warmOn = false;
            //     this.coolOn = false;
            //     this.colorName = '#B3B3B3';
            // }
            this.loading = false;
            this.toastr.error(err.error['message']);
        });
    }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    }

    rgbToHex(r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }

    onDownload(filters: any, type: string): void {
        this.loading = true;
        let url = new URL(`${environment.baseUrlSB}/building/schedule_devices/`);
        for (const key in filters) {
          if (!!filters[key]) {
            url.searchParams.set(key, filters[key]);
          }
        };
        url.searchParams.set('export', type);
        let fileName = this.bulbDetailTableConfig.title + ' List';
    
        this.apiService.getExportXlsPdf(url.href).subscribe((resp: any) => {
          if (type === 'pdf') {
            this.downloadPdf(resp, fileName);
          } else {
            this.downloadCSV(resp, fileName);
          }
          this.loading = false;
        }, (err: any) => {
          this.loading = false;
          this.toastr.error(err.error.message);
        });
      }
    
      downloadPdf(resp: any, title: string) {
        const data = resp;
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob)
    
        let fileLink = document.createElement('a');
        fileLink.href = url
        fileLink.download = title;
        fileLink.click();
      }
    
      downloadCSV(resp: any, title: string) {
        const data = resp;
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob)
    
        let fileLink = document.createElement('a');
        fileLink.href = url
        fileLink.download = title;
        fileLink.click();
      }
}




