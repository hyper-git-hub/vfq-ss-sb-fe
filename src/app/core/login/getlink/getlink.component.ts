import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-getlink',
  templateUrl: './getlink.component.html',
  styleUrls: ['./getlink.component.scss']
})
export class GetlinkComponent implements OnInit {

  recordedVedio: any;

  constructor(private route: ActivatedRoute,
    private router : Router) {
    

    this.route.queryParams.subscribe(params => {
        this.recordedVedio = params.videoUrl;
        // console.log(this.recordedVedio);
    });
    this.recordedVedio = decodeURIComponent(this.recordedVedio);
   }

  ngOnInit(): void {
  }

}
