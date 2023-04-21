import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CustomValidators } from './../../custom.validator';
import { apiIdentifier, ports } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-first-time-login',
  templateUrl: './first-time-login.component.html',
  styleUrls: ['./first-time-login.component.scss']
})
export class FirstTimeLoginComponent implements OnInit {

  resetPassowordForm: FormGroup

  show_newpassword: boolean;
  show_currpassword: boolean;
  showConfirmPassword: boolean;
  passwordIsValid: boolean;
  errorMessages: any[];
  port: any;


  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {
    this.show_newpassword = false;
    this.show_currpassword = false;
    this.showConfirmPassword = false;
    this.passwordIsValid = false;

    this.errorMessages = [];
    this.port = ports;

    this.resetPassowordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      password: ['', Validators.compose([
        Validators.required, Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,15}$')]
      )],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: [CustomValidators.samePasswords, CustomValidators.passwordMatcher]
    });
  }

  ngOnInit(): void {
  }

  onSubmitReset(formValues: any) {
    if (this.validatePasswordForm()) {
      const params = {};
      params['email'] = localStorage.getItem('tempEmail');
      params['current_password'] = formValues.oldPassword;
      params['new_password'] = formValues.confirmPassword;
      const resetPassUrl = `${apiIdentifier.userMS}${this.port.userMS}/users/authentication/password`;
      this.apiService.post(resetPassUrl, params).subscribe((resp: any) => {
        this.toastr.success(resp.message, '', {
          progressBar: true,
          progressAnimation: "decreasing",
          timeOut: 3000,
        });
        localStorage.removeItem('tempEmail');
        this.skipForNow();
      }, (err: any) => {
        this.toastr.error(err.error['message'], '', {
          progressBar: true,
          progressAnimation: "decreasing",
          timeOut: 3000,
        });
      });
    }
  }

  get resetFormControls() {
    return this.resetPassowordForm.controls;
  }

  validatePasswordForm(): boolean {
    let isValid = true;
    this.errorMessages = [];
    if (this.resetPassowordForm.hasError('mismatch')) {
      this.errorMessages.push('Mismatch Password');
      isValid = false;
    }
    if (this.resetPassowordForm.hasError('same')) {
      this.errorMessages.push('Password cannot be same');
      isValid = false;
    }
    return isValid;
  }

  skipForNow() {
    // before navigating to dashboard screen set the user name and photo in header by calling user-profile API 
    const profileUrl = `${apiIdentifier.userMS}${this.port.userMS}/users/user-profile`;
    this.apiService.get(profileUrl).subscribe((resp: any) => {
      localStorage.setItem('user', JSON.stringify(resp.data));
      // before navigating to dashboard screen set the idle time by calling getconfiguration API 
      const configUrl = `${apiIdentifier.userMS}${this.port.userMS}/users/user-profile/preferences`;
      this.apiService.get(configUrl).subscribe((configResponse: any) => {
        if (configResponse.data.length > 0) {
          // set the configuration settings 
          localStorage.setItem("configurations", JSON.stringify(configResponse.data[0]));
          this.router.navigate(['/ss/dashboard/surveillance/']);
        }
      }, err => { });
    }, err => { });
  }

  passwordValid(event) {
    this.passwordIsValid = event;
  }
}
