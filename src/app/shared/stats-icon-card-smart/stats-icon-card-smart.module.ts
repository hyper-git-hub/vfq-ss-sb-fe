import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsIconCardSmartComponent } from './stats-icon-card-smart/stats-icon-card-smart.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    StatsIconCardSmartComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FlexLayoutModule,
  ],
  exports: [
    StatsIconCardSmartComponent,
  ]
})
export class StatsIconCardSmartModule { }
