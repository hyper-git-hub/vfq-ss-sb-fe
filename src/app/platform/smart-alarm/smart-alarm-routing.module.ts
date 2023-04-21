import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmokeDetailComponent } from './smoke-detail/smoke-detail.component';
import { SmokeComponent } from './smoke/smoke.component';
import { WaterLeakageDetailComponent } from './water-leakage-detail/water-leakage-detail.component';
import { WaterLeakageComponent } from './water-leakage/water-leakage.component';

const routes: Routes = [  
{ path: 'smoke', component: SmokeComponent },
{ path: 'smoke-detail/:id', component: SmokeDetailComponent },
{ path: 'water-leakage', component: WaterLeakageComponent },
{ path: 'water-leakage-detail/:id', component: WaterLeakageDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartAlarmRoutingModule { }
