import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PaginationComponent } from './pagination.component';

import { CommonModule } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    PaginationComponent
  ],
  exports: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
  ],
  providers: []
})
export class PaginatorModule { }
