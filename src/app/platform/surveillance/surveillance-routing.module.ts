import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeozoneComponent } from './geozone/geozone.component';
import { LiveFeedComponent } from './live-feed/live-feed.component';
import { ManageCamerasComponent } from './manage-cameras/manage-cameras.component';
import { PlayBackComponent } from './play-back/play-back.component';

const routes: Routes = [
  { path: 'live-feed', component: LiveFeedComponent },
  { path: 'play-back', component:  PlayBackComponent },
  { path: 'geo-zone', component:  GeozoneComponent },
  { path: 'manage-cameras', component: ManageCamerasComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveillanceRoutingModule { }
