import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceSchedulingComponent } from './device-scheduling/device-scheduling.component';
import { RouterModule, Routes } from '@angular/router';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { DeviceFilterModule } from 'src/app/shared/device-filter/device-filter.module';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  { path: '', component: DeviceSchedulingComponent }
]


@NgModule({
  declarations: [
    DeviceSchedulingComponent,
    ScheduleFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),

    NgbModule,
    FlexLayoutModule,
    NgSelectModule,
    
    BreadcrumbsModule,
    DeviceFilterModule,
    GeneralTableModule
  ]
})
export class SchedulingModule { }
