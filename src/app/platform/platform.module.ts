import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformRoutingModule } from './platform-routing.module';
import { MainDashboardModule } from '../core/dashboard/dashboard.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PlatformRoutingModule,
    MainDashboardModule
  ]
})
export class PlatformModule { }
