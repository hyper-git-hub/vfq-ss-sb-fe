import { Component } from '@angular/core';
import { AlertService } from './shared/alert/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'smart-surveillance';
  loading;

  constructor(private alertService: AlertService) {
    this.loading = true;


  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // var url1 = "ws://localhost:4405";
    // var url2 = "ws://localhost:4407";
    // var url3 = "ws://localhost:4503";

    // var canvas = document.getElementById("video-canvas");

    // setTimeout(() => {
    //   let url = "ws://localhost:4403";
    //   let url1 = "ws://localhost:4405";
    //   let url2 = "ws://localhost:4407";
    //   let url3 = "ws://localhost:4503";
    //   console.log(url);
    //   // @ts-ignore JSMpeg defined via script
    //   // let player = new JSMpeg.VideoElement("#video-canvas", url)
    //   var canvas = document.getElementById("video-canvas");
    //   // @ts-ignore JSMpeg defined via script
    //   var player = new JSMpeg.Player(url, { canvas: canvas });
    //    // @ts-ignore JSMpeg defined via script
    //   // let player = new JSMpeg.VideoElement("#video-canvas", url)
    //   var canvas1 = document.getElementById("video-canvas1");
    //   // @ts-ignore JSMpeg defined via script
    //   var player1 = new JSMpeg.Player(url1, { canvas: canvas1 });
  
    //    // @ts-ignore JSMpeg defined via script
    //   // let player = new JSMpeg.VideoElement("#video-canvas", url)
    //   var canvas2 = document.getElementById("video-canvas2");
    //   // @ts-ignore JSMpeg defined via script
    //   var player2 = new JSMpeg.Player(url2, { canvas: canvas2 });
  
    //    // @ts-ignore JSMpeg defined via script
    //   // let player = new JSMpeg.VideoElement("#video-canvas", url)
    //   var canvas3 = document.getElementById("video-canvas3");
    //   // @ts-ignore JSMpeg defined via script
    //   var player3 = new JSMpeg.Player(url3, { canvas: canvas3  });
  

  
    //   console.log(player1);
    //   console.log("qwertyuio");
    // }, 5000);

  }

  ngAfterViewInit() {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     // this.loading = true;
    //   }
    //   else if (
    //     event instanceof NavigationEnd ||
    //     event instanceof NavigationCancel
    //   ) {
    //     this.loading = false;
    //   }
    // });
  }

  // @HostListener('window:onbeforeunload')
  // ngOnDestroy() {
  //   let val = localStorage.getItem('setvalue');
  //   if (val != "true") {
  //     this.authService.unsetUser();
  //   }
  // }
}
