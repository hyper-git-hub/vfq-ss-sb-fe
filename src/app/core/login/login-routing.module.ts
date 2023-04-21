import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnonymousGuardService } from 'src/app/services/anonymous-guard';
import { AnonymousGetGuardService } from 'src/app/services/anonymousget-guard';

import { LoginComponent } from './login/login.component';
import { FirstTimeLoginComponent } from './first-time-login/first-time-login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { GetlinkComponent } from './getlink/getlink.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    // canActivate: [AnonymousGuardService]
  },
  {
    path: 'first-time-login',
    component: FirstTimeLoginComponent,
    // canActivate: [AnonymousGuardService]
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: 'getlink', component: GetlinkComponent,
    canActivate: [AnonymousGetGuardService]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
