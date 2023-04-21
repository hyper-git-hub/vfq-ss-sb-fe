import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DateUtils } from 'src/app/Utils/DateUtils';

import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-bulb-form',
    templateUrl: './bulb-form.component.html',
    styleUrls: ['./bulb-form.component.scss']
})
export class BulbFormComponent implements OnInit {
    loading: boolean;
    title: string;
    turnOnBulb: boolean;

    scheduleForm: FormGroup;
    startDate: FormControl = new FormControl(null);
    bulbRGB = new FormControl('#B3B3B3');

    days: any[] = [];
    start_days: any[] = [];
    device_children_id: any[] = [];
    device_configuration: any;
    
    data: any;
    warm: any;
    cool: any;
    deviceId: any;
    config: any;
    rgbcolor: any;
    saturaion: any;
    brightnessfinal: any;
    colorName: any = null;
    bulbname: any;
    bulbActionPayload: any;

    constructor(
        private modalRef: NgbActiveModal,
        public formBuilder: FormBuilder,
        private toastr: ToastrService,
        private apiService: ApiService,
    ) {
        this.loading = false;
        this.turnOnBulb = false;
        this.deviceId = null;
        this.data = null;
        this.title = 'Add ';

        this.scheduleForm = this.formBuilder.group({
            id: [null],
            schedule_name: [null, [Validators.required]],
            state: [true, [Validators.required]],
            start_time: [null, [Validators.required]],
            end_time: [null, [Validators.required]],
            repeat: [false],
            start_date: [null],
            device_children_id: [null],
            device_configuration: [null],
        });

        const rgb = this.hexToRgb('#B3B3B3');
        this.bulbActionPayload = { rgb: '', w1: '1', w2: '1', warm: '212', white: '100' };
        const action = 'setColors';
        let payload = { 'rgbww': `${rgb.r},${rgb.g},${rgb.b},${this.bulbActionPayload.w1},${this.bulbActionPayload.w2}` };
        this.setConfiguration(action, payload);

        this.start_days = [
            { id: 0, value: 0, name: 'Monday', select: false },
            { id: 1, value: 1, name: 'Tuesday', select: false },
            { id: 2, value: 2, name: 'Wednesday', select: false },
            { id: 3, value: 3, name: 'Thursday', select: false },
            { id: 4, value: 4, name: 'Friday', select: false },
            { id: 5, value: 5, name: 'Saturday', select: false },
            { id: 6, value: 6, name: 'Sunday', select: false },
        ];
    }

    ngOnInit(): void {
        if (this.data) {
            console.log("data:",this.data)
            this.bulbname = this.data.device_name;
            this.getScheduleDetails();
        }

        this.getBulbState();

        this.bulbRGB.valueChanges.subscribe(value => {
            this.colorName = value;
            this.rgbcolor = this.hexToRgb(value);
            this.bulbActionPayload.rgb = this.rgbcolor;

            const action = 'setColors';
            let payload = { 'rgb': this.rgbcolor.r + ',' + this.rgbcolor.g + ',' + this.rgbcolor.b };
            this.setConfiguration(action, payload);
        });
    }

    getScheduleDetails() {
        this.loading = true;
        const slug = `${environment.baseUrlDevice}/api/schedule-task/?device_id=${this.deviceId}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            const dt = resp.data['data'][0];
            if (!!dt) {
                this.start_days.forEach(ele => {
                    dt.start_date.forEach(st => {
                        if (ele.id === st) {
                            ele.select = true;
                            this.onSelectDay(ele);
                        }
                    });
                });
            }
            this.loading = false;
            dt.start_time = DateUtils.getLocalTime(dt.start_time);
            dt.end_time = DateUtils.getLocalTime(dt.end_time);
            this.scheduleForm.patchValue(dt);
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error['message'], 'Error getting schedule details');
        });
    }

    getBulbState() {
        
    }

    onSelectDay(ev: any) {
        if (ev.select) {
            this.days.push(ev.value);
        } else {
            const idx = this.days.findIndex(ele => ele === ev.value);
            if (idx !== -1) {
                this.days.splice(idx, 1)
            }
        }
    }

    saturation() {
        const saturationcode = document.querySelectorAll('.input10');
        let saturaions: any = null;

        if (saturationcode.length > 0) {
            if (saturationcode[0].id === "saturate") {
                saturaions = Number(saturationcode[0]['value']);
                this.saturaion = `saturate(${saturaions})`;
            }
        }

        this.bulbActionPayload.w2 = saturaions;
        const action = 'setColors';
        let payload = { 'rgbww': `${this.rgbcolor?.r},${this.rgbcolor?.g},${this.rgbcolor?.b},${this.bulbActionPayload.w1},${saturaions}` };
        this.setConfiguration(action, payload);
    }

    brightness() {
        let bulb = document.getElementById("bulb");
        const brightnesscode = document.querySelectorAll('.input11');
        let brightn: any = null;

        if (brightnesscode.length > 0) {
            if (brightnesscode[0].id === "bright") {
                brightn = Number(brightnesscode[0]['value']);
                this.brightnessfinal = `brightness(${brightn}%)`;
            }
        }

        this.bulbActionPayload.w1 = brightn;
        const action = 'setColors';
        let payload = { 'rgbw': `${this.rgbcolor.r},${this.rgbcolor.g},${this.rgbcolor.b},${brightn}` };
        this.setConfiguration(action, payload);
    }

    onCloseModel() {
        this.modalRef.close();
    }

    setOnOff(ev: any) {
        const onOff = ev.target['checked'];
        let action = onOff ? 'BulbPowerOn' : 'BulbPowerOff';
        let payload = { "power": onOff ? '1' : '0' };
        this.setConfiguration(action, payload);
        
        const slug = `${environment.baseUrlDevice}/api/device/action`;
        let payload1: any = {
            device_id: this.deviceId,
            configuration: this.config
        }
        this.postDeviceAction(slug, payload1);
    }

    warmLight(ev: any) {
        this.warm = ev;
        this.colorName = ev === 'WARM_LIGHT' ? '#FCF9D9' : '#fffff';
        const action = 'setColors';
        const payload = { "warm": "212" };
        this.setConfiguration(action, payload);

        // const slug = `${environment.baseUrlDevice}/api/device/action`;
        // let payload1: any = {
        //     device_id: this.deviceId,
        //     configuration: this.config
        // }
        // this.postDeviceAction(slug, payload1);
    }

    whiteLight(ev: any) {
        this.cool = ev;
        this.colorName = ev === 'WHITE_LIGHT' ? '#F4FDFF' : '#fffff'
        const action = 'setColors';
        const payload = { "white": "100" };
        this.setConfiguration(action, payload);
        
        // const slug = `${environment.baseUrlDevice}/api/device/action`;
        // let payload1: any = {
        //     device_id: this.deviceId,
        //     configuration: this.config
        // }
        // this.postDeviceAction(slug, payload1);
    }

    setConfiguration(action: string, payload: any) {
        const config: any = {
            action: action,
            payload: payload
        }
        this.config = config;
        console.log(this.config);
    }

    hexToRgb(hex: any) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
    }

    onSubmit() {
        if (this.scheduleForm.invalid) {
            return;
        }

        this.loading = true;
        const slug1 = `${environment.baseUrlDevice}/api/device/action`;
        let payload1: any = {
            device_id: this.deviceId,
            configuration: this.config
        }
        
        const formData = this.scheduleForm.value;
        let slug = `${environment.baseUrlDevice}/api/schedule-task`;
        let devConfig = { action: formData.state ? 'BulbPowerOn' : 'BulbPowerOff', payload: { "power": formData.state ? '1' : '0' } };
        let payload: any = {
            device_id: this.deviceId,
            schedule_name: formData.schedule_name,
            start_date: this.days,
            start_time: DateUtils.getUTCTime(formData.start_time),
            end_time: DateUtils.getUTCTime(formData.end_time),
            // end_time: formData.end_time,
            repeat: formData.repeat,
            state: formData.state,
            device_children_id: [],
            device_configuration: devConfig,
        };

        if (this.data) {
            slug = `${environment.baseUrlDevice}/api/schedule-task?schedule_id=${this.data.schedule_id}`
            this.updateSchedule(slug, payload);
        } else {
            this.createSchedule(slug, payload);
            this.postDeviceAction(slug1, payload1);
        }
    }

    createSchedule(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: any) => {
            this.toastr.success(resp.message);
            this.loading = false;
            this.modalRef.close();
        }, (err: any) => {
            this.toastr.error(err.error.message);
            this.loading = false;
        });
    }
    
    updateSchedule(slug: string, payload: any) {
        payload.schedule_id = this.data.schedule_id;
        this.apiService.patch(slug, payload).subscribe((resp: any) => {
            this.toastr.success(resp.message);
            this.loading = false;
            this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error.message);
        });
    }

    postDeviceAction(slug?: string, payload?: any) {
        console.log(this.turnOnBulb);
        this.loading = true;
        this.apiService.post(slug, payload).subscribe((resp: any) => {
            this.toastr.success(resp.message);
            this.turnOnBulb = resp.message.includes('turned on') ? true : false;
            console.log(this.turnOnBulb);
            this.loading = false;
        }, (err: any) => {
            this.loading = false;
            this.turnOnBulb = false;
            this.toastr.error(err.error.message);
            // this.loading = false;
        });
    }
}
