import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildingDetailComponent } from './building-detail/building-detail.component';
import { BuildingComponent } from './building/building.component';

const routes: Routes = [
  { path: 'building', component: BuildingComponent },
  { path: 'building-detail/:id', component: BuildingDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageBuildingRoutingModule { }
