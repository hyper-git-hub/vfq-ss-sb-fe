import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertDialogComponent } from './alert.dialog';


@NgModule({
  declarations: [
    AlertDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FlexLayoutModule
  ],
  exports: [
    AlertDialogComponent
  ]
})
export class SharedAlertModule { }
