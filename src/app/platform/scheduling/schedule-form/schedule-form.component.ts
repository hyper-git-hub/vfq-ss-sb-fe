import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss']
})
export class ScheduleFormComponent implements OnInit {
  loading: boolean;
  turnOnBulb: boolean;
  stateRequired: boolean;

  title: string;
  customerId: number;

  deviceTypes: any[];
  devices: any[];
  days: any[];
  start_days: any[];

  warm: any;
  cool: any;
  deviceId: any;
  data: any;
  config: any;
  device_configuration: any;
  rgbcolor: any;
  saturation: any;
  brightness: any;
  colorName: any;
  devicesPayload: any;
  filters: any;
  deviceInfo: any;
  selectedDeviceType: any;

  scheduleForm: FormGroup;
  startDate: FormControl;
  actions: Subject<any>;

  constructor(
    private modalRef: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private toastrService: ToastrService,
  ) {
    this.loading = false;
    this.loading = false;
    this.stateRequired = false;
    this.title = 'Create Schedule';

    this.deviceTypes = [
      { id: 'Bulb', value: 'bulb', title: 'Bulb' },
      { id: 'Socket', value: 'socket', title: 'Socket' },
    ];
    this.selectedDeviceType = 'Bulb';
    this.devices = [];
    this.days = [];
    this.start_days = [];
    this.start_days = [
      { id: 0, value: 0, name: 'Monday', select: false },
      { id: 1, value: 1, name: 'Tuesday', select: false },
      { id: 2, value: 2, name: 'Wednesday', select: false },
      { id: 3, value: 3, name: 'Thursday', select: false },
      { id: 4, value: 4, name: 'Friday', select: false },
      { id: 5, value: 5, name: 'Saturday', select: false },
      { id: 6, value: 6, name: 'Sunday', select: false },
    ];

    this.scheduleForm = this.formBuilder.group({
      id: [null],
      device_type: [null],
      device: [null, [Validators.required]],
      schedule_name: [null, [Validators.required]],
      state: [true],
      start_time: [null, [Validators.required]],
      end_time: [null, [Validators.required]],
      repeat: [false],
      start_date: [null],
      device_configuration: [null],

      bulbRGB: ['#B3B3B3'],
      brightness: [100],
      saturation: [1]
    });
    this.startDate = new FormControl(null);
    this.actions = new Subject();

    let user: any = JSON.parse(localStorage.getItem('user'));
    this.customerId = user.customer['customer_id'];

    this.colorName = '#B3B3B3';
    const rgb = this.hexToRgb('#B3B3B3');
    this.devicesPayload = { rgb: '', w1: '1', w2: '1', warm: '212', white: '100' };
    // const action = 'setColors';
    // let payload = { 'rgbww': `${rgb.r},${rgb.g},${rgb.b},${this.devicesPayload.w1},${this.devicesPayload.w2}` };
    let action = 'BulbPowerOff';
    let payload = { "power": '0' };
    this.setConfiguration(action, payload);
  }

  ngOnInit(): void {
    // this.scheduleForm.get('bulbRGB').disable();
    // this.scheduleForm.get('saturation').disable();
    // this.scheduleForm.get('brightness').disable();

    if (this.data) {
      this.selectedDeviceType = this.data['device_type'];
      this.deviceId = this.data.device;
      this.getScheduleDetails();
    }
    this.scheduleForm.controls['bulbRGB'].valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
      this.colorName = value;
      this.rgbcolor = this.hexToRgb(value);
      this.devicesPayload.rgb = this.rgbcolor;

      const action = 'setColors';
      let payload = { 'rgb': this.rgbcolor.r + ',' + this.rgbcolor.g + ',' + this.rgbcolor.b };
      this.setConfiguration(action, payload);
    });

    this.scheduleForm.controls['saturation'].valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(val => {
      this.setSaturation(val);
    });

    this.scheduleForm.controls['brightness'].valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(val => {
      this.setBrightness(val);
    });
  }

  getScheduleDetails() {
    this.loading = true;
    const slug = `${environment.baseUrlDevice}/api/schedule-task/?device_id=${this.deviceId}&schedule_id=${this.data.schedule_id}`;

    this.apiService.get(slug).subscribe((resp: any) => {
      const dt = resp.data['data'][0];
      this.loading = false;
      if (!!dt) {
        this.start_days.forEach(ele => {
          dt.start_date.forEach(st => {
            if (ele.id === st) {
              ele.select = true;
              this.onSelectDay(ele);
            }
          });
        });
        if (this.selectedDeviceType === 'Bulb') {
          const configPayload = dt.device_configuration['payload'];
          this.setBulbData(configPayload);
        }
        this.config = dt?.device_configuration
        this.scheduleForm.patchValue(dt);
      }
    }, (err: any) => {
      this.loading = false;
      this.toastrService.error(err.error['message'], 'Error getting schedule details');
    });
  }

  setBulbData(dt: any) {
    for (const key in dt) {
      if (key === 'power') {
        this.turnOnBulb = dt['power'] === '1' ? true : false;
      } else if (key === 'rgb') {
        let rd = dt['rgb'].split(',');
        const hex = this.rgbToHex(rd[0], rd[1], rd[2]);
        this.colorName = hex;
        this.scheduleForm.get('bulbRGB')?.setValue(hex);
      } else if (key === 'rgbw') {
        let rd = dt['rgbw'].split(',');
        const hex = this.rgbToHex(rd[0], rd[1], rd[2]);
        this.colorName = hex;
        this.scheduleForm.get('bulbRGB')?.setValue(hex);
        this.scheduleForm.get('brightness')?.setValue(rd[rd.length - 1]);
      } else if (key === 'rgbww') {
        let rd = dt['rgbww'].split(',');
        const hex = this.rgbToHex(rd[0], rd[1], rd[2]);
        this.scheduleForm.get('bulbRGB')?.setValue(hex);
        this.scheduleForm.get('brightness')?.setValue(rd[rd.length - 1]);
        this.scheduleForm.get('saturation')?.setValue(rd[rd.length - 2]);
        this.colorName = hex;
      }
    }
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

  getDevices(type: any) {
    this.loading = true;
    const slug = `${environment.baseUrlSB}/building/smart_devices/?device_type=${type}&customer_id=${this.customerId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.loading = false;
      this.devices = resp.data['data'];
    }, (err: any) => {
      this.loading = false;
    });
  }

  onFilterSignals(ev: any) {
    this.filters = ev;
    if (!!ev.device_type) {
      this.scheduleForm.get('device_type')?.setValue(ev.device_type);
      if (ev.device_type == 'socket') {
        this.stateRequired = true
        this.scheduleForm.get('state').setValidators([Validators.required]);
      } else {
        this.stateRequired = false;
        this.scheduleForm.get('state').removeValidators([Validators.required]);
      }
    }
    if (!!ev.device) {
      this.scheduleForm.get('device')?.setValue(ev.device);
      this.deviceId = ev.device;
      this.getDeviceLastState();
    }
  }

  hexToRgb(hex: any) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
  }

  componentToHex(c) {
    var hex = c.toString(16);
    console.log(hex);
    return hex.length == 1 ? "0" + hex : hex;
  }

  rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

  warmLight() {
    this.colorName = '#FCF9D9';
    const action = 'setColors';
    const payload = { "warm": "212" };
    this.setConfiguration(action, payload);
  }

  whiteLight() {
    this.colorName = '#F4FDFF';
    const action = 'setColors';
    const payload = { "white": "100" };
    this.setConfiguration(action, payload);
  }

  setSaturation(value) {
    this.saturation = `saturate(${value})`;
    this.devicesPayload.w2 = value;

    const action = 'setColors';
    let payload = { 'rgbww': `${this.rgbcolor?.r},${this.rgbcolor?.g},${this.rgbcolor?.b},${this.devicesPayload.w1},${value}` };
    this.setConfiguration(action, payload);
  }

  setBrightness(value) {
    this.brightness = `brightness(${value}%)`;
    this.devicesPayload.w1 = value;

    const action = 'setColors';
    let payload = { 'rgbw': `${this.rgbcolor.r},${this.rgbcolor.g},${this.rgbcolor.b},${value}` };
    this.setConfiguration(action, payload);
  }

  setOnOff(ev: any) {
    if (ev != void 0 && this.selectedDeviceType === 'Socket') {
      let action = ev ? 'turnOnSocket' : 'turnOffSocket';;
      let payload = { "power": ev ? '1' : '0' };
      this.setConfiguration(action, payload);  
    }
  }

  setBulbOnOff(ev: any) {
    const onOff = ev.target['checked'];
    if (!this.deviceId) {
      this.toastrService.error('Please select device Id');
      this.turnOnBulb = false;
      return;
    }

    if (onOff != void 0) {
      this.setBulbConfig(onOff);
    }

    if (onOff) {
      this.scheduleForm.get('bulbRGB').enable();
      this.scheduleForm.get('saturation').enable();
      this.scheduleForm.get('brightness').enable();

      this.setOnBulb();
    } else {
      this.scheduleForm.get('bulbRGB').disable();
      this.scheduleForm.get('saturation').disable();
      this.scheduleForm.get('brightness').disable();
    }
  }

  setBulbConfig(onOff: any) {
    let action = onOff ? 'BulbPowerOn' : 'BulbPowerOff';;
    let payload = { "power": onOff ? '1' : '0' };
    this.setConfiguration(action, payload);
  }

  setOnBulb() {
    this.loading = true;
    const slug = `${environment.baseUrlDevice}/api/device/action`;
    let payload = {
      device_id: this.deviceId,
      configuration: this.config
    }
    
    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.getBulbLastState();
    }, (err: any) => {
      this.loading = false;
      this.turnOnBulb = false;
      this.colorName = '#B3B3B3';
      this.scheduleForm.get('bulbRGB').disable();
      this.scheduleForm.get('saturation').disable();
      this.scheduleForm.get('brightness').disable();
      this.setBulbConfig(false);
      this.toastrService.error(err.error['message']);
    });
  }

  getBulbLastState() {
    this.loading = true;
    const slug = `${environment.baseUrlDevice}/api/device/state?device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
        const dt = resp.data['device_last_configuration'];
        this.setBulbData(dt.payload);
        this.deviceInfo = resp.data;
        this.loading = false;
    }, (err: any) => {
        this.loading = false;
        // this.setBulbConfig(false);
        this.whiteLight();
        this.toastrService.error(err.error['message']);
    });
  }

  getDeviceLastState() {
    this.loading = true;
    const slug = `${environment.baseUrlDevice}/api/device/state?device_id=${this.deviceId}`;
    this.apiService.get(slug).subscribe((resp: any) => {
        const dt = resp.data['device_last_configuration'];
        if (this.selectedDeviceType === 'Bulb') {
          this.setBulbData(dt.payload);
        } else {
          
        }
        this.deviceInfo = resp.data;
        this.loading = false;
    }, (err: any) => {
        this.loading = false;
        // this.setBulbConfig(false);
        this.whiteLight();
        this.toastrService.error(err.error['message']);
    });
  }

  setConfiguration(action: string, payload: any) {
    const config: any = {
      action: action,
      payload: payload
    }
    this.config = config;
    // console.log(this.config);
  }

  onSubmit() {
    let slug = `${environment.baseUrlDevice}/api/schedule-task`;
    const formData = this.scheduleForm.value;

    let payload = {
      device_id: formData.device,
      schedule_name: formData.schedule_name,
      start_time: formData.start_time,
      end_time: formData.end_time,
      repeat: formData.repeat,
      start_date: this.days,
      state: formData.state,
      device_children_id: [],
      device_configuration: this.config,
    }

    if (this.data) {
      slug = `${environment.baseUrlDevice}/api/schedule-task?schedule_id=${this.data.schedule_id}`
      this.updateSchedule(slug, payload);
    } else {
      this.createSchedule(slug, payload);
    }
  }

  createSchedule(slug: string, payload: any) {
    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.toastrService.success(resp.message);
      this.loading = false;
      this.modalRef.close();
    }, (err: any) => {
      this.toastrService.error(err.error.message);
      this.loading = false;
    });
  }

  updateSchedule(slug: string, payload: any) {
    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      this.toastrService.success(resp.message);
      this.loading = false;
      this.modalRef.close();
    }, (err: any) => {
      this.loading = false;
      this.toastrService.error(err.error.message);
    });
  }

  onCloseModel() {
    this.modalRef.close();
  }
}
