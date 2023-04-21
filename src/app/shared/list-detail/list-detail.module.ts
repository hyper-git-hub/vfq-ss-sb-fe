import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDetailComponent } from './list-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbsModule } from '../breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,

    BreadcrumbsModule,
    FlexLayoutModule,
  ],
  exports: [
    ListDetailComponent
  ]
})
export class ListDetailModule { }
