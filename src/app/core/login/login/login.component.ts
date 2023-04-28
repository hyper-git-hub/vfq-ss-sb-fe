import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { apiIdentifier, environment, ports } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';
// import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean;
  showPassword: boolean;
  showCaptcha: boolean;
  errorMessage: string;
  captchaAdded: string;
  wrongPasswordAttemptCounter: number;
  port: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private apiService: ApiService,
    // private fbauth: AngularFireAuth
  ) {
    this.loading = false;
    this.showCaptcha = false;
    this.showPassword = false;
    this.captchaAdded = "captchaAdded";

    this.wrongPasswordAttemptCounter = 0;
    this.port = ports;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{3,3}$")]],
      password: ['', Validators.required],
      remember: [false],
      recaptcha: ['']
    });

    this.emailControl.valueChanges.subscribe(x => {
      if (this.emailControl.invalid) {
        this.rememberControl.disable();
      } else if (this.emailControl.value && this.passwordControl.value) {
        this.rememberControl.enable();
      }
    });

    this.passwordControl.valueChanges.subscribe(x => {
      if (this.passwordControl.invalid) {
        this.rememberControl.disable();
      } else if (this.emailControl.value && this.passwordControl.value) {
        this.rememberControl.enable();
      }
    });

    const uName = localStorage.getItem('useremail');
    const uPassword = localStorage.getItem('userpassword');
    // let val = localStorage.getItem('setvalue');
    if (!!uName && !!uPassword) {
      this.loginForm.patchValue({
        email: uName,
        password: uPassword,
        remember: true,
      });
    }
  }

  addTokenLog(message: string, token: string | null) {
    // this.log.push(`${message}: ${this.formatToken(token)}`);
  }

  get f() {
    return this.loginForm['controls'];
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  get rememberControl(): FormControl {
    return this.loginForm.get('remember') as FormControl;
  }

  onSubmit() {
    this.loading = true;
    const formData = this.loginForm.value;
    if (this.validate()) {
      // if `REMEMBER ME` checkbox is selected. Store email and password in local storage
      if (formData.remember) {
        localStorage.setItem('remember', formData.remember);
        localStorage.setItem('useremail', formData.email);
        localStorage.setItem('userpassword', formData.password);
      }

      const videoUrl = localStorage.getItem('videoUrl');
      const go2Link = localStorage.getItem('go2Link');
      // const uname = localStorage.getItem('uname');

      this.loginForm.value['email'] = this.loginForm.value['email'].toLowerCase();

      // delete this.loginForm.value['recaptcha'];
      // delete this.loginForm.value['remember'];
      // let params = this.loginForm.value;
      // params['usecase'] = 5;

      let payload = {
        email: formData.email,
        password: formData.password,
        usecase: 5
      }

      const loginUrl = `${apiIdentifier.userMS}${this.port.userMS}/users/authentication/login`;
      this.apiService.post(loginUrl, payload).subscribe((apiResponse: any) => {

        if (go2Link === 'true') {
          localStorage.setItem('useremail', this.loginForm.value['email']);
          localStorage.removeItem('videoUrl');
          this.router.navigateByUrl(`/getlink?videoUrl=${videoUrl}`);
          return;
        }

        localStorage.setItem('useremail', this.loginForm.value['email']);
        localStorage.setItem('token', apiResponse.data['Token']);
        this.signInFB(apiResponse.data['fb_auth_token']);

        this.wrongPasswordAttemptCounter = 0;

        const profileUrl = `${apiIdentifier.userMS}/users/user-profile`;
        this.apiService.get(profileUrl).subscribe((resp: any) => {
          localStorage.setItem('user', JSON.stringify(resp.data));
          // const userReset = resp.data;

          // if (userReset && userReset.customer && userReset.customer.associations && userReset.customer.associations.length > 0) {
          //   const findAssociation = userReset.customer.associations.filter(item => {

          //     return item.usecase === 2
          //   })

          //   if (findAssociation.length === 0) {
          //     this.toastr.error('User does not exist.');
          //     let params = { 'email': userReset.email }
          //     this.headerService.logOut(params, this.port.userMS).subscribe((data: any) => {

          //     })
          //     return false;
          //   }
          // }

          const featureURL = `${environment.baseUrlRA}/api/role-and-access/user-feature?use_case_id=5`;
          this.apiService.get(featureURL).subscribe((resp: any) => {
            let ft: any[] = [];
            let camFt: any[] = [];
            resp.data['features'].forEach((element: string) => {
              if (element.includes('cam')) {
                camFt.push(element);
              } else {
                ft.push(+element);
              }
            });
            const write = resp.data['write'];
            const perm = { write: write === 'WRITE' ? true : false };
            localStorage.setItem('permission', JSON.stringify(perm));
            // if (resp.data && resp.data['write']) {
            // }
            localStorage.setItem('features', JSON.stringify(ft));
            localStorage.setItem('camera_features', JSON.stringify(camFt));
            
            // To move on first-time-login
            if (apiResponse.data.is_first_time_login) {
              console.log("firsttime")
              localStorage.setItem('tempEmail', this.loginForm.value['email']);
              this.router.navigate(['/first-time-login'])
              return;
            }
  
            // set the configuration settings 
            const configurationUrl = `${apiIdentifier.userMS}/users/user-profile/preferences`;
            this.apiService.get(configurationUrl).subscribe((configResponse: any) => {
              if (configResponse.data.length > 0) {
                localStorage.setItem("configurations", JSON.stringify(configResponse.data[0]))
                localStorage.setItem("notificationCount", '0')
  
                setTimeout(() => {
                  this.router.navigate(['/ss/dashboard/surveillance/']);
                }, 1000);
              }
            }, err => { this.loading = false; });
          }, (err: any) => {
            this.loading = false;
            this.toastr.error(err.error['message']);
          });
        }, err => { this.loading = false; });
      }, (err: any) => {
        this.loading = false;
        if (err.status == 400 || err.status == 401) {
          this.toastr.error(err.error['message']);
        }
        if (err.status == 401 || err.status == 404) {
          // show captacha on 3 wrong attempts
          this.wrongPasswordAttemptCounter++;
          if (this.wrongPasswordAttemptCounter >= 2) {
            this.showCaptcha = true;
            this.loginForm.controls.recaptcha.setValidators(Validators.required);
            this.loginForm.controls.recaptcha.updateValueAndValidity();
          } else {
            this.showCaptcha = false;
            this.loginForm.controls.recaptcha.setValidators(null);
            this.loginForm.controls.recaptcha.updateValueAndValidity();
          }
        } else if (err.status == 500) {
          // Error toastr is set in interceptot service
          localStorage.removeItem('useremail');
          localStorage.removeItem('userpassword');
          localStorage.removeItem('user');
        }
      });
    }
  }


  validate(): boolean {
    this.errorMessage = null;
    if (this.loginForm.get('email').hasError('required')) {
      this.errorMessage = 'Email is required';
      return false;
    }
    if (this.loginForm.get('email').hasError('isEmail')) {
      this.errorMessage = 'Email is not valid';
      return false;
    }
    if (this.loginForm.get('password').hasError('required')) {
      this.errorMessage = 'Password is required';
      return false;
    }
    return true;
  }

  onForgotPassword() {
    this.router.navigateByUrl('forget-password');
  }

  signInFB(token: any) {
    // this.fbauth.signInWithCustomToken(token).then((resp: any) => {
    // }, (err: any) => {});
  }
}
