import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenLineChartComponent } from './gen-line-chart.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    GenLineChartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NgbModule
  ],
  exports: [
    GenLineChartComponent
  ]
})
export class GenChartModule { }
