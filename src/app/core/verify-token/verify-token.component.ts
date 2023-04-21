import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { AngularFireAuth } from 'angularfire2/auth';
import { ToastrService } from 'ngx-toastr';

import { environment, ports } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { DataTransferService } from '../services/data-transfer.service';
import { HeaderService } from '../services/header.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-verify-token',
  templateUrl: './verify-token.component.html',
  styleUrls: ['./verify-token.component.css']
})
export class VerifyTokenComponent implements OnInit {
  userData: any;
  port = ports;
  token: any;

  constructor(public activatedRoute: ActivatedRoute,
    private authService: AuthService, private router: Router,
    private headerService: HeaderService,
    // public afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private dataTransferService: DataTransferService,
    public userService: UserService) {
      this.token = this.activatedRoute.snapshot.queryParams['token'];

      if (this.token) {
        localStorage.setItem('token', this.token);

      this.userService.getUserProfileData(this.port.userMS).subscribe((data: any) => {
        this.authService.setUser(data.data);
        // before navigating to dashboard screen set the idle time by calling getconfiguration API 
        this.userService.getConfigurationsData(this.port.userMS).subscribe((configResponse: any) => {
          if (configResponse.data.length > 0) {
            // set the configuration settings 
            localStorage.setItem("configurations", JSON.stringify(configResponse.data[0]))
            this.dataTransferService.setConfigurationData(configResponse.data[0])
            this.router.navigate(['/ss/']);
            // this.headerService.getFeatures(this.port.monolith).subscribe((apiResponse: any) => {
            //   let array = apiResponse.data.features;
            //   localStorage.setItem('usergroups', JSON.stringify(apiResponse.data.groups))
             
            // }, err => {
            //   this.toastr.error(err.error.message)
            // })
          }
        }, err => {

        })
    }, err => {
      console.log(err);
    })

  }
  }

  ngOnInit(): void {
  }


  // SignOut() {
  //   return this.afAuth.auth.signOut().then((res) => {
  //     console.log(res);
  //   })
  // }

}
