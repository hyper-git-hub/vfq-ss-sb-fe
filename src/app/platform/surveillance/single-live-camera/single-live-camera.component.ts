import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserserviceService } from 'src/app/core/services/userservice.service';
import { ApiService } from 'src/app/services/api.service';
import { environment, ports } from 'src/environments/environment';
import { LivefeedformComponent } from '../livefeedform/livefeedform.component';

@Component({
  selector: 'app-single-live-camera',
  templateUrl: './single-live-camera.component.html',
  styleUrls: ['./single-live-camera.component.scss']
})
export class SingleLiveCameraComponent implements OnInit, OnDestroy {

  @Input() title: string;

  livefeed: FormGroup;
  breadCrumbs: any[];
  hallways: any[];
  camera: any[];
  building: any[];
  views: any;
  user: any;
  userGuid: any;
  customerid: any;
  camerasData: any[];
  loading: boolean;
  cameraid: any

  urlPort = ports;

  vidUrl = 'https://demo.flashphoner.com:8888/embed_player?urlServer=wss://demo.flashphoner.com:8443&streamName=rtsp://office:office123@58.65.164.43:554/cam/realmonitor?channel=4%26subtype=0&mediaProviders=WebRTC,MSE';
  rtsp: any;
  urlLinks: any[] = [];
  detailFilters: any;

  constructor(
    private dialog: NgbActiveModal,
    private formBuilder: FormBuilder,
    private userservice: UserserviceService,
    private authService: AuthService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private domSanitizer: DomSanitizer
  ) {

    this.title = 'Single Camera';
    this.user = this.authService.getUser();
    this.userGuid = this.user?.guid;
    this.customerid = this.user.customer.customer_id;
    this.detailFilters = { customer_id: this.customerid, guid: this.userGuid, live: true, camera_id: 'CAM1', ip_address: '51.144.150.199' };

    this.loading = false;

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

    this.urlLinks = [
      {
        id: 1,
        camera: 'One',
        viewCount: 10,
        downloadCount: 19,
        // url: 'http://20.103.238.54:94/liveserver/654/out.m3u8'
      },
      {
        id: 2,
        camera: 'Two',
        viewCount: 10,
        downloadCount: 19,
        // url: 'http://20.103.238.54:94/liveserver/654/out.m3u8'
      },
      {
        id: 3,
        camera: 'Three',
        viewCount: 10,
        downloadCount: 19,
        // url: 'http://20.103.238.54:94/liveserver/654/out.m3u8'
      },
    ]

    this.livefeed = this.formBuilder.group({
      first_name: [null],
    });

    this.camerasData = [
      {
        imageURL: './assets/images/cctv.png',
        downloadCount: 19,
        viewCount: 10,
        cameraName: 'Camera 1',
        name: 'Asad',
      },
      {
        imageURL: './assets/images/cctv.png',
        downloadCount: 19,
        viewCount: 10,
        cameraName: 'Camera 2',
        name: 'Ali ',
      },
    ]

    this.building = [
      { id: 1, name: 'building 1' },
      { id: 2, name: 'building 2' },
    ];

    this.camera = [
      { id: 1, name: 'camera 1' },
      { id: 2, name: 'camera 2' },
    ];
    this.hallways = [
      { id: 1, name: 'Hallways' },
      { id: 2, name: 'Lobby' },
      { id: 2, name: 'Stairs' },
    ];
  }

  ngOnInit(): void {
    this.getuserprefrence();
    this.runCameras();
    // this.getCameraDetails(this.detailFilters);
  }

  getuserprefrence() {
    this.views = null;
    const slug = `${environment.baseUrlSS}/user-preference?guid=${this.userGuid}`;
    this.apiService.get(slug).subscribe((resp: any) => {
      this.views = resp.data;
    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error getting layout preferances');
    });
  }

  runCameras() {
    let url = new URL(`${environment.baseUrlStreaming}/surveillance/livestream/`);
    let payload = { ip_address: '51.144.150.199', camera_id: 'CAM1' };
    this.apiService.post(url.href, payload).subscribe((resp: any) => {
      this.vidUrl += resp.data['url'];
      this.rtsp = this.domSanitizer.bypassSecurityTrustResourceUrl(this.vidUrl);
    }, (err: any) => {
      this.toastr.error(err.error['message']);
    });
  }

  getCameraDetails(filters: any): void {
    this.camerasData = [];
    let url = new URL(`${environment.baseUrlSS}/manage-camera`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }
    // let params = `customer_id=${this.customerid}&live=${true}&guid=${this.userGuid}`;
    // this.userservice.getCameraDetail(params, this.urlPort.monolith)
    // const url = `${environment.baseUrlSS}/manage-camera?customer_id=${this.customerid}&live=${true}&guid=${this.userGuid}`
    this.apiService.get(url.href).subscribe((resp: any) => {
      const dt = resp.data;
      this.cameraid = dt.map(t => t.id);
      dt.forEach(element => {
        this.camerasData.push({
          camera_name: element.camera_name,
          camera_id: element.camera_id,
          url: `https://dev.gateway.iot.vodafone.com.qa/ss-camera/liveserver/${element.camera_id}/out.m3u8`,
          views: element.views,
          downloads: element.downloads
        });
      });
      //  this.loading = false;

    }, (err: any) => {
      //  this.loading = false;
    });
  }

  updateLayout(value: any) {
    let payload = { layout: value };
    // let params = `guid=${this.userGuid}`;
    // this.userservice.saveViews(payload, params, this.urlPort.monolith).subscribe((data: any) => {
    const slug = `${environment.baseUrlSS}/user-preference?guid=${this.userGuid}`;
    this.apiService.patch(slug, payload).subscribe((resp: any) => {
      this.toastr.success(resp.message, '');
      this.getuserprefrence();
    }, err => {
      this.toastr.error(err.error.message, 'Error updating layout');
    });
  }

  ngOnDestroy(): void {
    // this.patchCameraViews();
  }

  onCloseModel() {
    this.dialog.close();
  }
}
