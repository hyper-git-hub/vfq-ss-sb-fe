import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/core/services/auth.service';
import { UserserviceService } from 'src/app/core/services/userservice.service';
import { ApiService } from 'src/app/services/api.service';
import { FormConfig } from 'src/app/shared/general-forms/models';
import { DateUtils } from 'src/app/Utils/DateUtils';
import { environment, ports } from 'src/environments/environment';
import { playbackFormConfig, playbackTimeFormConfig } from './Playback-config';
import * as dateFns from 'date-fns';


@Component({
  selector: 'app-play-back',
  templateUrl: './play-back.component.html',
  styleUrls: ['./play-back.component.scss'],
})
export class PlayBackComponent implements OnInit {
  @ViewChild('download') download: ElementRef;

  model: NgbDateStruct;
  breadCrumbs: any[];
  // actions: Subject<any>;
  formConfig: FormConfig;
  formConfig1: FormConfig;
  filterplayback = { starttime: '', endtime: '', camera: '' };
  recordedVedio; //: any[];
  downloadVideo; //: any[];

  downloadHiddenOne = false;
  downloadHiddenTwo = true;

  loading: boolean;
  beforeClick: boolean = true;
  urlPort = ports;
  user: any;
  userGuid: any;
  Cameradropdown: any[];
  customerid: any;
  camid: any;
  camera_id: any;
  destination: string;
  cameraarr: any[];
  playbackFilters: any;
  actions: Subject<any> = new Subject();
  camIds: string = '';
  viewCounts: any[];
  
  cameraFeatures: any[];
  devices: any[];
  buildings: any[];
  areas: any[];
  floors: any[];
  spaces: any[];
  rooms: any[];
  openAreas: any[];

  pbFilterForm: FormGroup;
  pbFilters: any;
  maxStartDate: any;

  constructor(
    private apiService: ApiService,
    private userservice: UserserviceService,
    private toastr: ToastrService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // this.recordedVedio = 'https://dlslabs.blob.core.windows.net/888/888_playback_327.m3u8?sp=r&st=2022-07-07T13:54:28Z&se=2022-07-29T21:54:28Z&sv=2021-06-08&sr=b&sig=hRAQOK91X9971X32mFaKOyfe4rM0li%2Bot2PnEGSp67s%3D';
    this.loading = false;

    this.formConfig = new FormConfig(playbackFormConfig.config);
    this.formConfig1 = new FormConfig(playbackTimeFormConfig.config);

    this.actions = new Subject();
    this.playbackFilters = {};

    this.breadCrumbs = [
      {
        name: 'Surveillance',
        url: '/ss/surveillance/livefeed',
        icon: 'ri-phone-camera-line',
      },
      {
        name: 'Playback',
        url: '',
        icon: '',
      },
    ];

    this.cameraFeatures = [];
    this.devices = [];
    this.buildings = [];
    this.areas = [{ id: 'floor', name: 'By Floor' }, { id: 'openArea', name: 'By Open Area' }];
    this.floors = [];
    this.spaces = [];
    this.rooms = [];
    this.openAreas = [];

    const cf: any = JSON.parse(localStorage.getItem('camera_features'));
    if (cf.length > 0) {
      cf.forEach(element => {
        element = element.replace('cam_', '');
        this.cameraFeatures.push(element);
      });
    }

    this.pbFilterForm = this.fb.group({
      building: [null],
      area: [null],
      floor: [null],
      space: [null],
      room: [null],
      open_area: [null],
      device: [null, [Validators.required]],
      date_filter: ['today'],
      start_date: [{value: null, disabled: true}],
      end_date: [{value: null, disabled: true}]
    });

    this.pbFilters = { device_type: 'Camera', customer_id: this.customerid }
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.userGuid = this.user?.guid;
    this.customerid = this.user.customer.customer_id;
    // this.getCameralisting();
    this.getCameraDevices(this.pbFilters);
    this.getBuildings();
  }

  getBuildings() {
    let slug = `${environment.baseUrlSB}/building/`;
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
    if (!!ev) {
      this.floors = [];
      this.spaces = [];
      this.rooms = [];
      this.openAreas = [];
      this.pbFilterForm.controls['floor'].setValue(null);
      this.pbFilterForm.controls['area'].setValue(null);
      this.pbFilterForm.controls['space'].setValue(null);
      this.pbFilterForm.controls['room'].setValue(null);
      this.pbFilterForm.controls['open_area'].setValue(null);
      this.pbFilters.building = ev;
      this.getBuildingFloors(ev);
      this.getCameraDevices(this.pbFilters);
    }
  }

  onAreaSelect(ev: any) {
    if (ev === 'floor') {
      this.pbFilterForm.get('floor').setValue(null);
      if (this.pbFilters.building) {
        this.getBuildingFloors(this.pbFilters.building);
      }
    } else {
      this.pbFilterForm.get('open_area').setValue(null);
      this.pbFilters.floor = '';
      this.pbFilters.space = '';
      this.pbFilters.space_attribute = '';
      if (this.pbFilters.building) {
        this.getBuildingOpenAreas(this.pbFilters.building);
      }
    }
  }

  onSelectFloor(ev: any) {
    this.pbFilters.floor = ev;
    if (!!ev) {
      this.pbFilterForm.controls['space'].reset();
      this.pbFilterForm.controls['room'].reset();
      this.pbFilterForm.controls['open_area'].reset();

      this.spaces = [];
      this.rooms = [];
      this.openAreas = [];
      this.getBuildingSpacesByFloor(ev);
      this.getCameraDevices(this.pbFilters);
    }
  }

  onSelectSpace(ev: any) {
    this.pbFilters.space = ev;
    if (!!this.pbFilters.floor && !!ev) {
      this.getRoomsBySpacesByFloor(this.pbFilters.floor, ev);
      this.getCameraDevices(this.pbFilters);
    }
  }

  onSelectRoom(ev: any) {
    this.pbFilters.space_attribute = ev;
    this.getCameraDevices(this.pbFilters);
  }

  onSelectOpenArea(ev: any) {
    this.pbFilters.open_area = ev;
    this.getCameraDevices(this.pbFilters);
  }

  onSelectDevice(ev: any) {
    console.log(ev);
  }

  getCameralisting(): void {
    this.Cameradropdown = [];
    let params = `customer_id=${this.customerid}`;
    this.userservice.getCameradropdown(params, this.urlPort.monolith).subscribe(
      (resp: any) => {
        const respcam = resp.data['data'];
        respcam.forEach((element) => {
          this.Cameradropdown.push({
            cameraid: element.camera_id,
            camid: element.id,
            name: element.camera_name,
          });
        });
        this.formConfig.columns[4].options = this.Cameradropdown;
      },
      (err: any) => {
        this.toastr.error(err.error.message);
      }
    );
  }

  getCameraDevices(filters: any) {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.devices = [];
      const dt = resp.data['data'];
      dt.forEach(dev => {
        this.cameraFeatures.forEach(ele => {
          if (dev.device === ele) {
            this.devices.push(dev);
          }
        });
      });
      // this.devices = resp.data['data'];
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting cameras');
    });
  }

  onSubmitFilter() {
    const dt = this.devices;
    if (!!dt) {
      dt.forEach((ele, idx) => {
        this.camIds += ele.device;
        this.playCameras(ele.device);
        if (idx !== dt.length - 1) {
          this.camIds += ',';
        }
      });
    }

    if (!!this.camIds && this.camIds !== '') {
      this.getCameraViews();
    } else {
      this.loading = false;
      this.toastr.info('No camera device assigned to this customer');
    }
  }

  playCameras(cameraID: any) {
    console.log(cameraID);
    let url = new URL(`${environment.baseUrlLiveStream}/camera/stream/playback`);
    let payload = { ip_address: '51.144.150.199', camera_id: cameraID };
    this.apiService.post(url.href, payload).subscribe((resp: any) => {
      this.setupSocket(resp['socket_port'], cameraID);
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }

  setupSocket(port: any, device: any) {
    setTimeout(() => {
      let url = `${environment.websocketUrl}/test?cameraId=${device}`;
      let idx = this.devices.findIndex(ele => {
        return ele.device === device;
      });
      var canvas = document.getElementById(this.devices[idx]?.id);
      // @ts-ignore JSMpeg defined via script
      var player2 = new JSMpeg.Player(url, { canvas: canvas });
    }, 1000);
  }
  getCameraViews() {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/views/`);
    url.searchParams.set('camera_ids', this.camIds);
    url.searchParams.set('guid', this.userGuid);

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.viewCounts = resp.data.data;

      this.devices.forEach(dev => {
        this.viewCounts.forEach((element: Object, idx) => {
          if (element.hasOwnProperty(dev.device)) {
            dev.views_count = element[dev.device];
          }
        });
      });
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], '');
    });
  }

  getplaybackVedio(filter: any): void {
    this.recordedVedio = [];
    this.loading = true;
    let params = `starttime=${filter.starttime}&endtime=${filter.endtime}&camera=${filter.camera}&customer_id=${this.customerid}`;
    this.userservice.getplayback(params).subscribe(
      (resp: any) => {
        this.loading = false;
        this.recordedVedio = resp.url;
        this.destination = `http://ss.dev.iot.vodafone.com.qa/getlink?videoUrl=${this.recordedVedio}`;
      },
      (err: any) => {
        this.loading = false;
        this.toastr.error(err.error.message);
      }
    );
  }

  onFilterSignals(ev: any) {
    if (!!ev.device && ev.device != '') {
      this.playbackFilters.camera_id = ev.device;
      this.playbackFilters.ip_address = '51.144.150.199';
    }
  }

  onGeneralFormSignal(ev: any) {
    if (!!ev.data['start']) {
      this.playbackFilters.starttime = dateFns.format(new Date(ev.data['start']), 'yyyy-MM-dd, hh:mm:ss');
    }
    if (!!ev.data['end']) {
      this.playbackFilters.endtime = dateFns.format(new Date(ev.data['end']), 'yyyy-MM-dd, hh:mm:ss');
    }
  }

  onSubmit() {
    this.loading = true;
    let url = new URL(`${environment.baseUrlLiveStream}/camera/stream/playback`);
    for (const key in this.playbackFilters) {
      if (!!this.playbackFilters[key]) {
        url.searchParams.set(key, this.playbackFilters[key]);
      }
    }
    console.log('submit', url.href);
    this.apiService.post(url.href, { camera_id: 'CAM1', ip_address: '51.144.150.199' }).subscribe((resp: any) => {
      this.loading = false;
      // this.playVideo();
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Unable to get playback video');
    });
  }

  onDonwload() {
    this.actions.next({ type: 'onSubmit' });
    let payload = {
      camera: this.camid,
      customer: this.customerid,
      user: this.userGuid,
      video_url: this.recordedVedio,
    };
    this.userservice.postDownloadVideo(payload, this.urlPort.userMS).subscribe(
      (resp: any) => {
        this.downloadHiddenOne = true;
        this.downloadHiddenTwo = false;
        this.downloadVideo = resp.data['mp4_url'];
        setTimeout(() => {
          this.download.nativeElement.click();
          this.toastr.success(resp.message);
        }, 100);
      },
      (err) => {
        this.toastr.error(err.error.message);
      }
    );
  }

  // GetLink(val: string) {
  //   console.log("val:", val)
  //   let selBox = document.createElement('textarea');
  //   selBox.style.position = 'fixed';
  //   selBox.style.left = '0';
  //   selBox.style.top = '0';
  //   selBox.style.opacity = '0';
  //   selBox.value = val;
  //   document.body.appendChild(selBox);
  //   selBox.focus();
  //   selBox.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(selBox);
  //   this.toastr.success("Link copy to ClickBoard");

  // }

  onReset() {
    this.actions.next({ type: 'onReset' });
    this.actions.next({ type: 'reset' });
  }

  onChangePeriod(ev: any) {
    console.log(ev.target.value);
    if (ev.target.value === 'range') {
      this.pbFilterForm.get('start_date').enable();
      this.pbFilterForm.get('end_date').enable();
    } else {
      this.pbFilterForm.get('start_date').disable();
      this.pbFilterForm.get('end_date').disable();
    }
  }

  onSelectDateRange(ev: any, type: any) {
    console.log(ev, type);
    this.maxStartDate = ev;
  }
}
