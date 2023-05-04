import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-getlink',
  templateUrl: './getlink.component.html',
  styleUrls: ['./getlink.component.scss']
})
export class GetlinkComponent implements OnInit {

  loadingStream: boolean;
  cameraId: any;
  starttime: any;
  endtime: any;
  player: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.loadingStream = false;
    this.route.queryParams.subscribe(params => {
      this.cameraId = params.videoUrl;
      this.starttime = params.starttime;
      this.endtime = params.endtime;
      console.log(this.cameraId);
    });
  }

  ngOnInit(): void {
    this.playVideo();
  }

  playVideo() {
    this.loadingStream = true;
    let url = new URL(`${environment.baseUrlLiveStream}/stream/playback/`);
    url.searchParams.set('starttime', this.starttime);
    url.searchParams.set('endtime', this.endtime);
    url.searchParams.set('camera_id', this.cameraId);

    this.apiService.get(url.href).subscribe((resp: any) => {
      this.setupSocket(resp.data['socketId'], this.cameraId);
    }, (err: any) => {
      this.loadingStream = false;
      this.toastr.error(err.error['message']);
    });
  }

  setupSocket(socketId: any, device: any) {
    setTimeout(() => {
      let url = `${environment.websocketUrl}/playback/?socketId=${socketId}`;

      this.loadingStream = false;
      var canvas = document.getElementById(device);
      // @ts-ignore JSMpeg defined via script
      this.player = new JSMpeg.Player(url, { canvas: canvas });
      console.log(this.player);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.destroy();
    }
  }
}
