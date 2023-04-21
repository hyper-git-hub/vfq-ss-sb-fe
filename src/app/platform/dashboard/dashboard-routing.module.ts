import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard';
import { OccupancyComponent } from './occupancy/occupancy.component';
import { SurveillanceComponent } from './surveillance/surveillance.component';

const routes: Routes = [
  { path: '', redirectTo: 'surveillance' },
  { path: 'surveillance', component: SurveillanceComponent, canActivate: [AuthGuardService] },
  { path: 'occupancy', component: OccupancyComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
