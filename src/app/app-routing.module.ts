import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifyTokenComponent } from './core/verify-token/verify-token.component';
// import { AuthGuardService } from './services/auth-guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./core/login/login.module').then(m => (m.LoginModule))
  },
  { path: 'verify-token', component: VerifyTokenComponent },
  {
    path: 'ss',
    loadChildren: () => import('./platform/platform.module').then(m => (m.PlatformModule))
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
