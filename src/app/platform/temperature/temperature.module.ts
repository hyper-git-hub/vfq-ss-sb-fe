import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemperatureRoutingModule } from './temperature-routing.module';
import { TemperatureComponent } from './temperature/temperature.component';
import { TemperatureDetailComponent } from './temperature-detail/temperature-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StatsIconCardSmartModule } from 'src/app/shared/stats-icon-card-smart/stats-icon-card-smart.module';
import { DeviceFilterModule } from 'src/app/shared/device-filter/device-filter.module';
import { LineChartModule } from 'src/app/shared/graphs/line-chart/line-chart.module';
import { ListDetailModule } from 'src/app/shared/list-detail/list-detail.module';
import { GenChartModule } from 'src/app/shared/graphs/gen-line-chart/gen-line-chart.module';
import { ListingModule } from 'src/app/shared/listing/listing.module';


@NgModule({
  declarations: [
    TemperatureComponent,
    TemperatureDetailComponent
  ],
  imports: [
    CommonModule,
    TemperatureRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    BreadcrumbsModule,
    GeneralTableModule,
    FlexLayoutModule,
    FormsModule,
    StatsIconCardSmartModule,
    DeviceFilterModule,
    LineChartModule,

    ListDetailModule,
    GenChartModule,
    ListingModule,
  ]
})
export class TemperatureModule { }
