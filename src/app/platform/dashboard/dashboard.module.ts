import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SurveillanceComponent } from './surveillance/surveillance.component';
import { OccupancyComponent } from './occupancy/occupancy.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { DirectivesModule } from 'src/app/shared/directives/module';
import { NgbModule, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { GeneralFormModule } from 'src/app/shared/general-forms/module';
import { GraphsModule } from 'src/app/shared/graphs/graphs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StatsIconsModule } from 'src/app/shared/stats-icon-card/module';
import { DeviceFormModule } from 'src/app/shared/device-form/device-form.module';
import { DeviceFilterModule } from 'src/app/shared/device-filter/device-filter.module';


@NgModule({
  declarations: [
    SurveillanceComponent,
    OccupancyComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    StatsIconsModule,
    GraphsModule,
    ReactiveFormsModule,
    NgSelectModule,
    VgStreamingModule,
    GeneralTableModule,   
    FlexLayoutModule,
    DirectivesModule,
    NgbModule,
    FormsModule,
    BreadcrumbsModule,
    GeneralFormModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    DeviceFormModule,
    DeviceFilterModule
  ],


})
export class DashboardModule { }
