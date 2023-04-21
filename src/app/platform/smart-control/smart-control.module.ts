import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartControlRoutingModule } from './smart-control-routing.module';
import { BulbComponent } from './bulb/bulb.component';
import { SocketComponent } from './socket/socket.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StatsIconCardSmartModule } from 'src/app/shared/stats-icon-card-smart/stats-icon-card-smart.module';
import { BulbDetailComponent } from './bulb-detail/bulb-detail.component';
import { BulbFormComponent } from './bulb-form/bulb-form.component';

import { SocketMainFormComponent } from './socket-main-form/socket-main-form.component';
import { DeviceFilterModule } from 'src/app/shared/device-filter/device-filter.module';
import { SocketDetailComponent } from './socket-detail/socket-detail.component';
import { SocketScheduleFormComponent } from './socket-schedule-form/socket-schedule-form.component';
import { DeviceFormComponent } from './device-form/device-form.component';



@NgModule({
  declarations: [
    BulbComponent,
    BulbDetailComponent,
    BulbFormComponent,
    DeviceFormComponent,
    SocketComponent,
    SocketMainFormComponent,
    SocketDetailComponent,
    SocketScheduleFormComponent
  ],
  imports: [
    CommonModule,
    SmartControlRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    BreadcrumbsModule,
    GeneralTableModule,
    FlexLayoutModule,
    FormsModule,
    StatsIconCardSmartModule,
    DeviceFilterModule
  ]
})
export class SmartControlModule { }
