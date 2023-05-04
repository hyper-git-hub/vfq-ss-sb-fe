import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AnonymousGetGuardService {
  is_authenticated: boolean;
  videoUrl: any;

  constructor (
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.videoUrl = route.queryParams['videoUrl'];
    let starttime = route.queryParams['starttime'];
    let endtime = route.queryParams['endtime'];
    const useremail = localStorage.getItem('useremail');
    const authToken = localStorage.getItem('token');

    // console.log("videoUrl:", this.videoUrl);
    // console.log(starttime);
    // console.log(endtime);

    if (!useremail || !authToken) {
      // console.log("useremail:", useremail);
      localStorage.setItem('videoUrl', this.videoUrl);
      localStorage.setItem('starttime', starttime);
      localStorage.setItem('endtime', endtime);
      localStorage.setItem('goToLink', 'true');

      this.is_authenticated = false;
      this.router.navigateByUrl('');
    } else {
      this.is_authenticated = true;
    }

    return this.is_authenticated;
  }
}
