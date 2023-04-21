import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { AuditRoutingModule } from './audit-routing.module';
import { AuditReportsComponent } from './audit-reports/audit-reports.component';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    AuditReportsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuditRoutingModule,

    NgSelectModule,
    BreadcrumbsModule,
    FlexLayoutModule,
    GeneralTableModule,
    NgbModule,
  ]
})
export class AuditModule { }
