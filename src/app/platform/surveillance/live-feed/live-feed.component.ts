import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserserviceService } from 'src/app/core/services/userservice.service';
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
  // hallways: any[];
  camera: any[];
  devices: any[];
  viewsDevices: any[];
  socketPorts: any[];
  building: any[];
  final: any[];
  camerasData: any[];
  displayData: any[];
  viewCounts: any[];
  cameraFeatures: any[];

  views: any;
  user: any;
  userGuid: any;
  customerid: any;
  zoomLevel: any;
  camIds: string;
  cameraid: any;
  mainArray = [];
  newdisplay = [];
  unAssignedUsers: any[] = [];
  // @Output() titleHeading = new EventEmitter<any>();
  // @Output() sectionValue = new EventEmitter<any>();
  urlPort = ports;

  vidUrl = 'https://demo.flashphoner.com:8888/embed_player?urlServer=wss://demo.flashphoner.com:8443&streamName=';
  rtsp: any;
  detailFilters: any;
  pc: RTCPeerConnection;
  player2: any;

  constructor(
    private dialog: NgbModal,
    private formBuilder: FormBuilder,
    private userservice: UserserviceService,
    private authService: AuthService,
    private toastr: ToastrService,
    private apiService: ApiService,
    private domSanitizer: DomSanitizer
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

    // this.hallways = [
    //   { id: 1, name: 'Hallways' },
    //   { id: 2, name: 'Lobby' },
    //   { id: 2, name: 'Stairs' },
    // ];

    this.socketPorts = [];
  }

  ngOnInit(): void {
    // this.playCameras();
    this.getUserPrefrence();
    this.getCameraDevices();
    this.getDisplay();
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



  getDisplay() {
    this.displayData = [];
    this.loading = true;
    const slug = `${environment.baseUrlSB}/building/display/`;

    this.apiService.get(slug).subscribe((resp: any) => {
      this.displayData = resp.data['data'];
      console.log("displayData:", this.displayData)

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
    // url.searchParams.set('customer_id', this.customerid);

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
      // console.log("this.newdisplay:", this.viewsDevices)

      if (this.newdisplay.length != 0) {
        this.devices = this.newdisplay;
        console.log("this.viewsDevices:", this.devices)
      }

      // this.devices = resp.data['data'];
      // const dt = resp.data['data'];

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
      } else {
        this.loading = false;
        this.toastr.info('No camera device assigned to this customer');
      }
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error['message'], 'Error getting cameras');
    });
  }

  onChangeView(ev: any) {
    console.log(" views selected == ", ev)
    const dt = ev;
    console.log("dt:", dt)
    console.log("viewsDevices", this.viewsDevices)
    if (dt) {
      dt.forEach(element => {
        this.viewsDevices.forEach(elem => {
          if (element.camera_id === elem.device_name) {
            this.final.push(elem);
            console.log("final:", this.final)
            // this.passEntry.emit(this.final);
          }
        });
      });
    }
    this.getCameraDevices();

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

  getCameraDetails(filters: any): void {
    this.camerasData = [];
    let url = new URL(`${environment.baseUrlSS}/manage-camera`);
    for (const key in filters) {
      if (!!filters[key]) {
        url.searchParams.set(key, filters[key]);
      }
    }

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

  playCameras(cameraID: any = 'CAM1') {
    // setTimeout(() => {
    //   // @ts-ignore JSMpeg defined via script
    //   // let player = new JSMpeg.VideoElement("#video-canvas", url)
    //   var canvas = document.getElementById('56');
    //   // @ts-ignore JSMpeg defined via script
    //   var player2 = new JSMpeg.Player('wss://staging.gateway.iot.vodafone.com.qa/sb_node_live_stream:443', { canvas: canvas });

    // }, 1200);

    let url = new URL(`${environment.baseUrlLiveStream}/camera/stream`);
    let payload = { ip_address: '51.144.150.199', camera_id: cameraID };
    this.apiService.post(url.href, payload).subscribe((resp: any) => {
      this.setupSocket(resp['socket_port'], cameraID);
    }, (err: any) => {
      this.toastr.error(err.error['message']);
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
      console.log(this.player2.source, this.player2.source.socket);
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

  open(content: any) {
    this.dialog.open(content);
  }


  onEditlivefeed(ev?: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: true };
    const dialogRef = this.dialog.open(LivefeedformComponent, options);
    dialogRef.componentInstance.title = 'Edit View';
    dialogRef.componentInstance.data = this.views;
    dialogRef.componentInstance.data1 = this.viewsDevices;
    dialogRef.componentInstance.catagory = 'edit';
  }

  onAddlivefeed(ev?: any) {
    const options: NgbModalOptions = { size: 'sm', scrollable: true };
    const dialogRef = this.dialog.open(LivefeedformComponent, options);
    dialogRef.componentInstance.title = 'Add View';
    dialogRef.componentInstance.data = this.views;
    // dialogRef.componentInstance.data1 = this.viewsDevices;
    // dialogRef.componentInstance.passEntry.subscribe((receivedEntry) => {
    // console.log(receivedEntry);
    // this.newdisplay = receivedEntry;
    // })
    // dialogRef.closed.subscribe((result) => {
    // this.getCameraDevices();
    // })
    dialogRef.componentInstance.catagory = 'add';

  }

  openSingleCamera(ev: any) {
    const options: NgbModalOptions = { size: 'lg', scrollable: false };
    const dialogRef = this.dialog.open(SingleLiveCameraComponent, options);

    dialogRef.componentInstance.title = ev.device_name ? ev.device_name : ev.device;
  }

  ngOnDestroy(): void {
    this.patchCameraViews();
    this.player2.destroy();
  }

  start() {
    let stream: any = new MediaStream();
    let config: any = {
      sdpSemantics: 'unified-plan',
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
    };

    this.pc = new RTCPeerConnection(config);
    let v = document.getElementById('vid') as HTMLVideoElement;

    // connect audio / video
    this.pc.addEventListener('track', function (evt) {
      stream.addTrack(evt.track);
      v.src = stream;
    });

    document.getElementById('start').style.display = 'none';
    this.negotiate();
    document.getElementById('stop').style.display = 'inline-block';
  }

  negotiate(): any {
    this.pc.addTransceiver('video', { direction: 'recvonly' });
    this.pc.addTransceiver('audio', { direction: 'recvonly' });
    return this.pc.createOffer().then(function (offer) {
      return this.pc.setLocalDescription(offer);
    }).then(function () {
      // wait for ICE gathering to complete
      return new Promise<void>(function (resolve) {
        if (this.pc.iceGatheringState === 'complete') {
          resolve();
        } else {
          function checkState() {
            if (this.pc.iceGatheringState === 'complete') {
              this.pc.removeEventListener('icegatheringstatechange', checkState);
              resolve();
            }
          }
          this.pc.addEventListener('icegatheringstatechange', checkState);
        }
      });
    }).then(function () {
      var offer = this.pc.localDescription;
      return fetch('http://127.0.0.1:8000/offer', {
        body: JSON.stringify({
          sdp: offer.sdp,
          type: offer.type,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });
    }).then(function (response) {
      return response.json();
    }).then(function (answer) {
      return this.pc.setRemoteDescription(answer);
    }).catch(function (e) {
      alert(e);
    });
  }






  playVlc(rtsp: string) {
    let div = document.createElement("div");
    div.setAttribute("id", '11');
    div.setAttribute("width", '450px');
    div.setAttribute("height", '340px');

    let embed = document.createElement("embed");
    embed.setAttribute("type", "application/x-vlc-plugin");
    embed.setAttribute("controls", "false");
    embed.setAttribute("pluginspage", "http://www.videolan.org");
    embed.setAttribute("width", "450px !important");
    embed.setAttribute("height", "340px !important");
    embed.setAttribute("loop", "no");
    embed.setAttribute("target", rtsp);

    let object = document.createElement("object");
    object.setAttribute("classid", "clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921");
    object.setAttribute("target", "http://download.videolan.org/pub/videolan/vlc/last/win32/axvlc.cab");
    object.setAttribute("width", "450px !important");
    object.setAttribute("height", "340px !important");

    div.append(embed);
    div.append(object);

    let videoDiv = document.getElementById('rtsp-video');
    videoDiv.append(div);

    // object.css("display:none");
    // let config = JSON.parse( `[
    //   "rtsp://system:Vodafone@51.144.150.199:9100/dss/monitor/param/cameraid=1000000%240%26substream=1?token=5776",
    //   "rtsp://username:password@your.ip.address:554/Streaming/Channels/201",
    //   "rtsp://username:password@your.ip.address:554/Streaming/Channels/301",
    //   "rtsp://username:password@your.ip.address:554/Streaming/Channels/402"
    // ]`);
  }
}
