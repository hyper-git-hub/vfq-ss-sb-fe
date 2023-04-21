import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainDashboardComponent } from '../core/dashboard/main-dashboard/main-dashboard.component';
import { AuthGuardService } from '../services/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: MainDashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'dashboard/surveillance' },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule) },
      { path: 'surveillance', loadChildren: () => import('./surveillance/surveillance.module').then((m) => m.SurveillanceModule) },
      { path: 'smart-control', loadChildren: () => import('./smart-control/smart-control.module').then((m) => m.SmartControlModule) },
      { path: 'smart-alarm', loadChildren: () => import('./smart-alarm/smart-alarm.module').then((m) => m.SmartAlarmModule) },
      { path: 'utilities', loadChildren: () => import('./controls/controls.module').then((m) => m.ControlsModule) },
      { path: 'manage-building', loadChildren: () => import('./manage-building/manage-building.module').then((m) => m.ManageBuildingModule) },
      { path: 'audit', loadChildren: () => import('./audit/audit.module').then((m) => m.AuditModule) },
      { path: 'alerts', loadChildren: () => import('./alerts/alerts.module').then((m) => m.AlertsModule) },
      { path: 'user-admin', loadChildren: () => import('./user-admin/user-admin.module').then((m) => m.UserAdminModule) },
      { path: 'reports', loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule) },
      { path: 'temperature', loadChildren: () => import('./temperature/temperature.module').then((m) => m.TemperatureModule) },
      { path: 'scheduling', loadChildren: () => import('./scheduling/scheduling.module').then( (m) => m.SchedulingModule ) },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/ss/dashboard/surveillance',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatformRoutingModule {}
