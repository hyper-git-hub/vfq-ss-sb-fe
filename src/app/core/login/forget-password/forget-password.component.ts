import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { apiIdentifier, ports } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  otpBox: boolean;
  emailForm: FormGroup;
  verifyForm: FormGroup;
  errorMessage: string;
  errorMessages: any;
  enteredEmail: string;
  emailMFA: string;
  mobileMFA: string;
  emailReturned: string = '';
  phoneReturned: string = '';
  port = ports;
  emailLayoutSection: boolean = true;
  OTPVerficationLayoutSection: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.emailForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{3,3}$'
          ),
        ],
      ],
    });

    this.verifyForm = this.formBuilder.group({
      mfaCode: ['', [Validators.required]], //Email MFA Code
      otpCode: ['', [Validators.required]], //SMS OTP Code
    });
  }

  ngOnInit(): void {}

  onEmailSubmit(formValue) {
    if (this.validate()) {
      this.enteredEmail = formValue['email'];
      const emailMFACode = `${apiIdentifier.userMS}${this.port.userMS}/users/authentication/mfa`;

      this.apiService.post(emailMFACode, formValue).subscribe(
        (apiResponse: any) => {
          this.emailLayoutSection = false;
          this.OTPVerficationLayoutSection = true;
          this.toastr.success(apiResponse.message, '', {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 3000,
          });

          this.emailMFA = apiResponse.data.email_mfa_code;
          this.mobileMFA = apiResponse.data.mobile_mfa_code;

          if (apiResponse?.data.length == 0) {
            this.emailReturned = '';
            this.phoneReturned = '';
          } else {
            this.emailReturned = apiResponse.data.email;
            this.phoneReturned = apiResponse.data.phone;
          }

          let obj = {
            emailCode: this.emailMFA,
            mobileCode: this.mobileMFA,
            email: this.enteredEmail,
          };
          // store email and mfa codes in localStorage instead of using setter getter
          localStorage.setItem('MFACodes', JSON.stringify(obj));
        },
        (err) => {
          this.toastr.error(err.error.message, '', {
            progressBar: true,
            progressAnimation: 'decreasing',
            timeOut: 3000,
          });
        }
      );
    }
  }

  navigateToResetPassword() {
    this.router.navigate(['change-password']);
  }

  onSubmitCode(formValue) {
    let param = {
      email: this.enteredEmail,
      email_mfa_code: formValue['mfaCode'],
      mobile_mfa_code: formValue['otpCode'],
    };
    const verificationUrl = `${apiIdentifier.userMS}${this.port.userMS}/users/authentication/mfa/verification`;

    this.apiService.post(verificationUrl, param).subscribe(
      (apiResponse: any) => {
        this.toastr.success(apiResponse.message, '', {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
        this.navigateToResetPassword();
      },
      (err: any) => {
        this.toastr.error(err.error.message, '', {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });
      }
    );
  }

  resendOTP() {
    let params = { email: this.enteredEmail };
    const resendMFACode = `${apiIdentifier.userMS}${this.port.userMS}/users/authentication/mfa`;

    this.apiService.post(resendMFACode, params).subscribe(
      (apiResponse: any) => {
        this.toastr.success('New OTP has been sent successfully', 'Code Sent', {
          progressBar: true,
          progressAnimation: 'decreasing',
          timeOut: 3000,
        });

        this.emailMFA = apiResponse.data.email_mfa_code;
        this.mobileMFA = apiResponse.data.mobile_mfa_code;

        if (apiResponse?.data.length == 0) {
          this.emailReturned = '';
          this.phoneReturned = '';
        } else {
          this.emailReturned = apiResponse.data.email;
          this.phoneReturned = apiResponse.data.phone;
        }

        let obj = {
          emailCode: this.emailMFA,
          mobileCode: this.mobileMFA,
          email: this.enteredEmail,
        };
        // store email and mfs codes in localStorage instead of using setter getter
        localStorage.setItem('MFACodes', JSON.stringify(obj));
      },
      (err: any) => {}
    );
  }

  validate(): boolean {
    let isValid = true;
    this.errorMessages = [];
    if (this.emailForm.hasError('required')) {
      this.errorMessages.push('Email is required');
      isValid = false;
    }
    if (this.emailForm.hasError('inEmail')) {
      this.errorMessages.push('Must enter a valid email');
      isValid = false;
    }
    return isValid;
  }

  backToLogin() {
    this.router.navigateByUrl('');
  }
}
