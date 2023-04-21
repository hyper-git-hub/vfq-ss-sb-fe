import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemperatureDetailComponent } from './temperature-detail/temperature-detail.component';
import { TemperatureComponent } from './temperature/temperature.component';

const routes: Routes = [
  {path: '', component: TemperatureComponent},
  {path: 'temperature-detail/:id', component: TemperatureDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemperatureRoutingModule { }
