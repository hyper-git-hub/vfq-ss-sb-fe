import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ConfirmedValidator } from 'src/app/core/model/ConfirmedValidator';
import { apiIdentifier, ports } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  resetPassowordForm: FormGroup;

  show_newpassword: boolean;
  showConfirmPassword: boolean;
  passwordIsValid: boolean;
  errorMessages: any[];
  port: any;
  data: any;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private apiService: ApiService,
    private toastr: ToastrService,
  ) {
    this.show_newpassword = false;
    this.showConfirmPassword = false;
    this.passwordIsValid = false;

    this.errorMessages = [];
    this.port = ports;
    this.data =  null;

    this.resetPassowordForm = this.formBuilder.group({
      newPassword: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,15}$')])],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator('newPassword', 'confirmPassword')
    });
  }

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem("MFACodes"));
  }

  onSubmitReset(formValues: any) {
    let params = {
      email: this.data.email,
      // email_mfa_code: this.data.emailCode,
      // mobile_mfa_code: this.data.mobileCode,
      password: formValues['newPassword']
    }

    const resetPassWordUrl = `${apiIdentifier.userMS}${this.port.userMS}/users/authentication/mfa/password`;
    this.apiService.post(resetPassWordUrl, params).subscribe((apiResponse: any) => {
      this.toastr.success(apiResponse.message, '', {
        progressBar: true,
        progressAnimation: "decreasing",
        timeOut: 3000,
      })
      this.router.navigate(['']);
      localStorage.removeItem('MFACodes');
    }, (err: any) => {
      this.toastr.error(err.error.message, '', {
        progressBar: true,
        progressAnimation: "decreasing",
        timeOut: 3000,
      });
    });
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

  ngOnDestroy() {
    localStorage.removeItem("MFACodes");
  }

  passwordValid(event) {
    this.passwordIsValid = event;
  }
}
