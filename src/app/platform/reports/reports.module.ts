import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { DirectivesModule } from 'src/app/shared/directives/module';
import { SearchModule } from 'src/app/shared/search/search-module';
import { PaginatorModule } from 'src/app/shared/pagination/module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { ReportsComponent } from './reports/reports.component';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GeneralFormModule } from 'src/app/shared/general-forms/module';
import { DeviceFilterModule } from "../../shared/device-filter/device-filter.module";
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    declarations: [ReportsComponent],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        NgSelectModule,
        FlexLayoutModule,
        GeneralTableModule,
        BreadcrumbsModule,
        DirectivesModule,
        SearchModule,
        PaginatorModule,
        CalendarModule,
        NgbModule,
        FormsModule,
        GeneralFormModule,
        DeviceFilterModule
    ]
})
export class ReportsModule {}
