import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgSelectModule } from '@ng-select/ng-select';

import { DeviceFormComponent } from './device-form.component';


@NgModule({
  declarations: [
    DeviceFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FlexLayoutModule,
    NgSelectModule
  ],
  exports: [
    DeviceFormComponent
  ]
})
export class DeviceFormModule { }
