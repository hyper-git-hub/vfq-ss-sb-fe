import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { environment, ports } from 'src/environments/environment';
import { LivefeedformComponent } from '../livefeedform/livefeedform.component';
import { SingleLiveCameraComponent } from '../single-live-camera/single-live-camera.component';


@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.component.html',
  styleUrls: ['./live-feed.component.scss']
})
export class LiveFeedComponent implements OnInit, OnDestroy {

  loading: boolean;
  breadCrumbs: any[];

  camera: any[];
  devices: any[];
  viewsDevices: any[];
  mainDevices: any[];
  buildings: any[];
  cameras: any[] = []
  displayData: any[];
  viewCounts: any[];
  cameraFeatures: any[];

  views: any;
  user: any;
  userGuid: any;
  cam_id: any;
  customerid: any;
  building_id: any;
  zoomLevel: any;
  camIds: string;
  cameraid: any;
  selectedCamera: any;
  globalIndex:any
  mainArray = [];
  newdisplay = [];
  downloadCounts: any[];
  unAssignedUsers: any[] = [];
  // @Output() titleHeading = new EventEmitter<any>();
  // @Output() sectionValue = new EventEmitter<any>();
  urlPort = ports;

  vidUrl = 'https://demo.flashphoner.com:8888/embed_player?urlServer=wss://demo.flashphoner.com:8443&streamName=';
  rtsp: any;
  detailFilters: any;
  player2: any;

  camView: FormControl = new FormControl(null);

  constructor(
    private dialog: NgbModal,
    private authService: AuthService,
    private toastr: ToastrService,
    private apiService: ApiService,
  ) {

    this.loading = false;
    this.user = this.authService.getUser();
    this.userGuid = this.user?.guid;
    this.customerid = this.user.customer.customer_id;

    this.detailFilters = { customer_id: this.customerid, guid: this.userGuid, live: true, camera_id: 'CAM1', ip_address: '51.144.150.199' };

    this.camIds = '';
    this.zoomLevel = '1';

    this.cameraFeatures = [];
    const cf: any = JSON.parse(localStorage.getItem('camera_features'));
    if (cf.length > 0) {
      cf.forEach(element => {
        element = element.replace('cam_', '');
        this.cameraFeatures.push(element);
      });
    }

    this.viewCounts = [];
    this.views = { layout: 2 };

    this.breadCrumbs = [
      {
        name: "Surveillance",
        url: "/ss/surveillance/livefeed",
        icon: "ri-phone-camera-line"
      },
      {
        name: "Live Feed",
        url: '',
        icon: ""
      },
    ]
  }

  ngOnInit(): void {
    // this.playCameras();
    this.getUserPrefrence();
    this.getCameraDevices();
    this.getBuildingList();
    // this.getCameraDownloads();
    
    // this.getCameraDetails(this.detailFilters);
  }

  getUserPrefrence() {
    this.loading = true;
    const slug = `${environment.baseUrlSB}/building/user-preferences/`;

    this.apiService.patch(slug, { guid: this.userGuid }).subscribe((resp: any) => {
      this.views = resp.data;
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting layout preferances');
    });
  }

  getCameraDevices() {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    url.searchParams.set('device_type', 'camera');
    url.searchParams.set('customer_id', this.customerid);

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.devices = [];
      const devs: any[] = [];
      const d = resp.data['data'];
      d.forEach(dev => {
        this.cameraFeatures.forEach(ele => {
          if (dev.device === ele) {
            this.devices.push(dev);
            devs.push(dev);
          }
        });
      });
      this.viewsDevices = this.devices;
      this.mainDevices = this.devices;

      this.getDisplay();

      // if (!!devs && devs.length > 0) {
      //   devs.forEach((ele, idx) => {
      //     this.camIds += ele.device;
      //     this.playCameras(ele.device);
      //     if (idx !== devs.length - 1) {
      //       this.camIds += ',';
      //     }
      //   });
      // }

      // if (!!this.camIds && this.camIds !== '') {
      //   this.getCameraViews();
      // } else {
      //   this.loading = false;
      //   this.toastr.info('No camera device assigned to this customer');
      // }
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting cameras');
    });
  }

  getDisplay(type?: string) {
    this.loading = true;
    const slug = `${environment.baseUrlSB}/building/display/?customer=${this.customerid}`;

    this.apiService.get(slug).subscribe((resp: any) => {
      this.displayData = resp.data['data'];
      const dt = resp.data['data'];
      if ((dt && dt.length) && type !== 'refresh') {
        this.camView.setValue(dt[0].id);
        this.onChangeView(dt[0].id);
      }
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting display layout');
    });
  }

  onChangeView(ev: any) {
    const dt = this.displayData.find(ele => {
      return ele.id === ev;
    });
    const final: any[] = [];
    const devs: any[] = [];
    // if (dt.display_phenomenun.length > 0) {
    //   console.log(dt);
    // }
    dt.display_phenomenun.forEach(element => {
      this.viewsDevices.forEach(elem => {
        if (element.camera_id === elem.device) {
          final.push(elem);
          devs.push(elem);
        }
      });
    });
    this.devices = final;

    this.camIds = '';
    if (!!devs && devs.length > 0) {
      devs.forEach((ele, idx) => {
        this.camIds += ele.device;
        this.playCameras(ele.device);
        if (idx !== devs.length - 1) {
          this.camIds += ',';
        }
      });
    }

    if (!!this.camIds && this.camIds !== '') {
      this.getCameraViews();
      this.getCameraDownloads();
    } else {
      this.loading = false;
      this.toastr.info('No camera device assigned to this customer');
    }
  }

  getCameraViews() {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/views/`);
    if (this.camIds != '') {
      url.searchParams.set('camera_ids', this.camIds);
    }
    url.searchParams.set('guid', this.userGuid);

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.viewCounts = resp.data.data;

      this.viewCounts.forEach((element: any, idx) => {
        this.devices.forEach(dev => {
          if (element.camera_name === dev.device) {
            dev['views_count'] = element['user_count'];
          }
        });
      });
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], '');
    });
  }

  getCameraDownloads() {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/downloads/`);
    url.searchParams.set('camera_ids', this.camIds);
    url.searchParams.set('guid', this.userGuid);
    // url.searchParams.set('type', 'mobile');

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.downloadCounts = resp.data.data;

      if (this.downloadCounts && this.downloadCounts.length > 0) {
        this.downloadCounts.forEach((element: any, idx) => {
          this.devices.forEach(dev => {
            if (element.camera_name === dev.device) {
              dev['download_count'] = element['user_count'];
            }
          });
        });
      }

      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], '');
    });
  }

  getBuildingList() {
    let slug = `${environment.baseUrlSB}/building/`;

    this.apiService.get(slug).subscribe((resp: any) => {
      this.buildings = resp.data['data'];
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error getting data for buildings');
    });
  }

  onSelectBuilding(ev: any) {
    this.getCameraforBuilding(ev);
  }

  getCameraforBuilding(building_id?: any) {
    let url = new URL(`${environment.baseUrlSB}/building/smart_devices/`);
    url.searchParams.set('device_type', 'camera')
    url.searchParams.set('customer_id', this.customerid)
    if (building_id) {
      url.searchParams.set('building', building_id)
    }

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.cameras = [];
      const d = resp.data['data'];
      d.forEach(dev => {
        this.cameraFeatures.forEach(ele => {
          if (dev.device === ele) {
            this.cameras.push(dev);
          }
        });
      });
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting cameras');
    });
  }

  onSelectCamera(ev: any) {
    this.cam_id = ev;
    this.selectedCamera = this.cameras.find(ele => {
      return ele.device === ev;
    });
  }
 
  showFootage(idx: number) {
    this.devices.splice(idx, 1, this.selectedCamera);
    this.globalIndex = idx;
    this.updateCameraViews(this.selectedCamera.device);
    this.playCameras(this.selectedCamera.device)
    setTimeout(() => {
      this.getCameraViewCount(this.selectedCamera.device, idx);
      this.getCameraDownloadCount(this.selectedCamera.device, idx);
      // this.selectedCamera = null;
    }, 1200);
    // this.getCameraViewsforDisplay(this.cam_id);
  }

  getCameraViewCount(camId: string, idx: number) {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/views/`);
    if (camId != '') {
      url.searchParams.set('camera_ids', camId);
    }
    url.searchParams.set('guid', this.userGuid);

    this.apiService.get(url.href).subscribe((resp: any) => {
      const dt = resp.data['data'];
      if (dt && dt.length > 0) {
        if (this.devices[idx].device === dt[0]['camera_name']) {
          console.log(dt);
          this.devices[idx].views_count = dt[0]['user_count'];
        }
      }

      // this.viewCounts = resp.data.data;
      // this.viewCounts.forEach((element: any) => {

      //   this.mainDevices.filter((elem) => {
      //     if (element.camera_name === elem.device) {
      //       elem['views_count'] = element['user_count'];
     
      //       this.devices.splice(this.globalIndex,1 ,elem)
      //     }
      //   })

      // })
      // this.getCameraDownloads();

      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], '');
    });
  }

  getCameraDownloadCount(camId: string, idx: number) {
    this.loading = true;
    let url = new URL(`${environment.baseUrlSB}/building/downloads/`);
    url.searchParams.set('camera_ids', camId);
    url.searchParams.set('guid', this.userGuid);
    // url.searchParams.set('type', 'mobile');

    this.apiService.get(url.href).subscribe((resp: any) => {
      const dt = resp.data['data'];
      if (dt && dt.length > 0) {
        if (this.devices[idx].device === dt[0]['camera_name']) {
          this.devices[idx].download_count = dt[0]['user_count'];
        }
      }
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], '');
    });
  }

  playCameras(cameraID: any = 'CAM1') {
    let url = new URL(`${environment.baseUrlLiveStream}/camera/stream`);
    let payload = { ip_address: '51.144.150.199', camera_id: cameraID };
    this.apiService.post(url.href, payload).subscribe((resp: any) => {
      this.setupSocket(resp['socket_port'], cameraID);
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Unable to play camera stream');
    });
  }

  setupSocket(port: any, device: any) {
    setTimeout(() => {
      let url = `${environment.websocketUrl}/?cameraId=${device}`;
      // let url = `ws://node-js-live-stream.appservices.hypernymbiz.com:4400/test?cameraId=CAM1`;
      // let url = `wss://staging.gateway.iot.vodafone.com.qa/sb_node_live_stream:443`;
      let idx = this.devices.findIndex(ele => {
        return ele.device === device;
      });
      // @ts-ignore JSMpeg defined via script
      // let player = new JSMpeg.VideoElement("#video-canvas", url)
      var canvas = document.getElementById(this.devices[idx]?.id);
      // @ts-ignore JSMpeg defined via script
      this.player2 = new JSMpeg.Player(url, { canvas: canvas });
    }, 1000);
  }

  moveCamera(ev: any, camId: any) {
    this.loading = true;
    const slug = `${environment.baseUrlStreaming}/surveillance/cameraptz/`;
    let payload = { stepY: '1', direct: ev, stepX: '1', command: '1', camera_id: camId };

    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Unable to move camera');
    });
  }

  onZoomCamera(ev: any, camId: any) {
    let zoomLevel = ev.target.value;
    this.zoomLevel = ev.target.value;
    this.loading = true;
    const slug = `${environment.baseUrlStreaming}/surveillance/cameraptz/`;
    let payload = { direct: zoomLevel, command: "1", step: "1", camera_id: camId };

    this.apiService.post(slug, payload).subscribe((resp: any) => {
      this.loading = false;
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], `Unable to zoom ${zoomLevel == '1' ? 'in' : 'out'}`);
    });
  }

  updateLayout(value: any) {
    this.loading = true;
    let payload = { layout: value, guid: this.userGuid };
    const slug = `${environment.baseUrlSB}/building/user-preferences/`;

    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      this.toastr.success(resp.message, '');
      this.loading = false;
      this.getUserPrefrence();
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error.message, 'Error updating layout');
    });
  }

  updateCameraViews(camId: any) {
    let payload = {
      camera_ids: camId,
      guid: this.userGuid
    }
    const slug = `${environment.baseUrlSB}/building/views/`;

    this.apiService.patch(slug, payload).subscribe((resp: any) => { }, (err: any) => {
      this.toastr.error(err.error.message, 'Error');
    });
  }

  patchCameraViews() {
    let payload: any = {};
    if (this.camIds != '') {
      payload = {
        camera: this.cameraid,
        guid: this.userGuid
      }
    }
    const slug = `${environment.baseUrlSB}/building/views/`;

    this.apiService.patch(slug, payload).subscribe((resp: any) => { }, (err: any) => {
      this.toastr.error(err.error.message, 'Error');
    });
  }

  onAddlivefeed(ev?: any) {
    const options: NgbModalOptions = { size: 'md', scrollable: true };
    const dialogRef = this.dialog.open(LivefeedformComponent, options);

    dialogRef.componentInstance.data = this.views;
    
    dialogRef.closed.subscribe((result) => {
      this.getDisplay('refresh');
    });
  }

  onEditlivefeed(ev?: any) {
    const options: NgbModalOptions = { size: 'md', scrollable: true };
    const dialogRef = this.dialog.open(LivefeedformComponent, options);
    
    dialogRef.componentInstance.title = 'Edit View';
    dialogRef.componentInstance.category = 'edit';
    dialogRef.componentInstance.data = this.views;

    dialogRef.closed.subscribe(() => {
      this.getDisplay('refresh');
    });
  }

  openSingleCamera(ev: any) {
    const options: NgbModalOptions = { size: 'xlhw', scrollable: false };
    const dialogRef = this.dialog.open(SingleLiveCameraComponent, options);

    dialogRef.componentInstance.title = ev.device_name ? ev.device_name : ev.device;
    dialogRef.componentInstance.cameraId = ev.device;
  }

  ngOnDestroy(): void {
    this.patchCameraViews();
    if (this.player2) {
      this.player2.destroy();
    }
  }
}
