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
  cameraId: any

  zoomLevel: any;

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

    this.livefeed = this.formBuilder.group({
      first_name: [null],
    });
  }

  ngOnInit(): void {
    // this.runCameras();
    this.playCameras(this.cameraId);
    // this.getCameraDetails(this.detailFilters);
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
      // let idx = this.devices.findIndex(ele => {
      //   return ele.device === device;
      // });
      // @ts-ignore JSMpeg defined via script
      // let player = new JSMpeg.VideoElement("#video-canvas", url)
      var canvas = document.getElementById(device);
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

  ngOnDestroy(): void {
    // this.patchCameraViews();
  }

  onCloseModel() {
    this.dialog.close();
  }
}
