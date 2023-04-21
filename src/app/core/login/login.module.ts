import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
  RecaptchaModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings,
  RecaptchaFormsModule,
  RECAPTCHA_V3_SITE_KEY,
  RecaptchaV3Module,
} from 'ng-recaptcha';
import { PasswordStrengthModule } from 'src/app/shared/password-strength/module';

import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { FirstTimeLoginComponent } from './first-time-login/first-time-login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { GetlinkComponent } from './getlink/getlink.component';

const RECAPTCHA_V3_STACKBLITZ_KEY = '6LeHBK0bAAAAAOQVTvBOWhfb08cQfUpFoSE3FsmP'; //'6LcvqmUeAAAAAJ0K1Og0FQOfeS6y0fa0G2Mg7kh2';
const RECAPTCHA_V2_DUMMY_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; //'6LcvqmUeAAAAACUcBTKYcuukGe_6kfpVuj4Ut3Tq';

@NgModule({
  declarations: [
    LoginComponent,
    FirstTimeLoginComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    GetlinkComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    FlexLayoutModule,
    RecaptchaModule, //.forRoot(),
    RecaptchaFormsModule,
    RecaptchaV3Module,
    VgStreamingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    LoginRoutingModule,
    PasswordStrengthModule,
  ],
  providers: [
    //FireBaseService,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: RECAPTCHA_V3_STACKBLITZ_KEY,
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: RECAPTCHA_V2_DUMMY_KEY,
      } as RecaptchaSettings,
    },
  ],
})
export class LoginModule {}
