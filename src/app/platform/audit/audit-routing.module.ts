import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditReportsComponent } from './audit-reports/audit-reports.component';


const routes: Routes = [
  { path: '', component: AuditReportsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRoutingModule { }
