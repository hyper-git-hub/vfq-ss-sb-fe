import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from '../core/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AnonymousGetGuardService {
  is_authenticated: boolean;
  videoUrl;//: any[];
  uname

  constructor(private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute) {

    //   this.route.queryParams
    //   .subscribe(params => {
    //     this.videoUrl = params.videoUrl;
    //     this.uname = params.uname;
    //     console.log(this.videoUrl);
    //     console.log(this.uname);
    //   }
    // );

  }




  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  
    
    this.videoUrl = route.queryParams['videoUrl'];
    // this.uname = route.queryParams['uname'];
    // localStorage.getItem(user)
   const useremail = localStorage.getItem('useremail');

    console.log("videoUrl:",this.videoUrl);
    // console.log("uname:",this.uname);
    // console.log("useremail:",useremail);
  
      if (!useremail) {
        console.log("useremail:",useremail);
        // console.log(useremail, this.uname);
        // localStorage.setItem('uname', this.uname);
        localStorage.setItem('videoUrl', this.videoUrl);
        localStorage.setItem('go2Link', 'true');

        this.is_authenticated = false;
        this.router.navigateByUrl('');
      } else {
        this.is_authenticated = true;
      }
    console.log(this.is_authenticated);
    return this.is_authenticated;
  }

}
