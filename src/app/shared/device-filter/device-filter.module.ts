import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceFilterComponent } from './device-filter/device-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    DeviceFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FlexLayoutModule,
    NgSelectModule
  ],
  exports: [
    DeviceFilterComponent
  ]
})
export class DeviceFilterModule { }
