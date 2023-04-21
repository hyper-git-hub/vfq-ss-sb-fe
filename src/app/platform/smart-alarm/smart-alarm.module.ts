import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartAlarmRoutingModule } from './smart-alarm-routing.module';
import { SmokeComponent } from './smoke/smoke.component';
import { WaterLeakageComponent } from './water-leakage/water-leakage.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DeviceFilterModule } from 'src/app/shared/device-filter/device-filter.module';
import { WaterLeakageDetailComponent } from './water-leakage-detail/water-leakage-detail.component';
import { MultiBarChartModule } from 'src/app/shared/graphs/multi-bar-chart/multi-bar-chart.module';
import { ListingModule } from 'src/app/shared/listing/listing.module';
import { ListDetailModule } from 'src/app/shared/list-detail/list-detail.module';
import { SmokeDetailComponent } from './smoke-detail/smoke-detail.component';
import { GenBarChartModule } from 'src/app/shared/graphs/gen-bar-chart/gen-bar-chart.module';


@NgModule({
  declarations: [
    SmokeComponent,
    WaterLeakageComponent,
    WaterLeakageDetailComponent,
    SmokeDetailComponent
  ],
  imports: [
    CommonModule,
    SmartAlarmRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    BreadcrumbsModule,
    GeneralTableModule,
    FlexLayoutModule,
    FormsModule,
    DeviceFilterModule,
    MultiBarChartModule,
    ListingModule,
    ListDetailModule,
    GenBarChartModule
  ]
})
export class SmartAlarmModule { }
