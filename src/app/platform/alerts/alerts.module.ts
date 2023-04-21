import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { DirectivesModule } from 'src/app/shared/directives/module';
import { PaginatorModule } from 'src/app/shared/pagination/module';
import { SearchModule } from 'src/app/shared/search/search-module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { DeviceFilterModule } from 'src/app/shared/device-filter/device-filter.module';

import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertsCamerasComponent } from './alerts-cameras/alerts-cameras.component';
import { AlertscameraformComponent } from './alertscameraform/alertscameraform.component';
import { NotificationComponent } from './notification/notification.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertFormComponent } from './alert-form/alert-form.component';


@NgModule({
  declarations: [
    AlertsCamerasComponent,
    AlertscameraformComponent,
    NotificationComponent,
    AlertsComponent,
    AlertFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AlertsRoutingModule,
    NgSelectModule,

    SharedModule,
    BreadcrumbsModule,
    GeneralTableModule,
    DirectivesModule,
    SearchModule,
    PaginatorModule,
    NgbModule,
    DeviceFilterModule,
    FlexLayoutModule
  ]
})
export class AlertsModule { }
