import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingComponent } from './listing.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BreadcrumbsModule } from '../breadcrumbs/breadcrumbs.module';
import { DeviceFilterModule } from '../device-filter/device-filter.module';
import { GeneralTableModule } from '../general-table/general-table.module';
import { StatsIconCardSmartModule } from '../stats-icon-card-smart/stats-icon-card-smart.module';



@NgModule({
  declarations: [
    ListingComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    BreadcrumbsModule,
    GeneralTableModule,
    FlexLayoutModule,
    FormsModule,
    StatsIconCardSmartModule,
    DeviceFilterModule
  ],
  exports: [
    ListingComponent
  ]
})
export class ListingModule { }
