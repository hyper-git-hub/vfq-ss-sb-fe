import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ListingModule } from 'src/app/shared/listing/listing.module';
import { ListDetailModule } from 'src/app/shared/list-detail/list-detail.module';
import { GenChartModule } from 'src/app/shared/graphs/gen-line-chart/gen-line-chart.module';

import { EnergyMeterComponent } from './energy-meter/energy-meter.component';
import { EnergyMeterDetailsComponent } from './energy-meter-details/energy-meter-details.component';
import { WaterMeterComponent } from './water-meter/water-meter.component';
import { WaterMeterDetailsComponent } from './water-meter-details/water-meter-details.component';

const routes: Routes = [
  { path: 'energy-meter', component: EnergyMeterComponent },
  { path: 'energy-meter-details/:id', component: EnergyMeterDetailsComponent },
  { path: 'water-meter', component: WaterMeterComponent },
  { path: 'water-meter-details/:id', component: WaterMeterDetailsComponent },
]


@NgModule({
  declarations: [
    EnergyMeterComponent,
    EnergyMeterDetailsComponent,
    WaterMeterComponent,
    WaterMeterDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    ListingModule,
    ListDetailModule,
    GenChartModule
  ]
})
export class ControlsModule { }
