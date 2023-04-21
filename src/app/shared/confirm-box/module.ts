import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmBoxComponent } from './confirm-box.component';


@NgModule({
  declarations: [
      ConfirmBoxComponent
  ],
  exports: [
      ConfirmBoxComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ConfirmBoxModule { }
