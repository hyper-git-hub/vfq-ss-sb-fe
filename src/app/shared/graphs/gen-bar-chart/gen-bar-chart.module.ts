import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenBarChartComponent } from './gen-bar-chart.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    GenBarChartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    NgbModule
  ],
  exports: [
    GenBarChartComponent
  ]
})
export class GenBarChartModule { }
