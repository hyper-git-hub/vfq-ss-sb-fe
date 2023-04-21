import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsCamerasComponent } from './alerts-cameras/alerts-cameras.component';
import { AlertsComponent } from './alerts/alerts.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  // { path: '', component: AlertsCamerasComponent },
  { path: '', component: AlertsComponent },
  { path: 'notification', component: NotificationComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertsRoutingModule { }
