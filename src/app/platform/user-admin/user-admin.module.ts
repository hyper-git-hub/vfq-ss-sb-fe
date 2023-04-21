import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { UserAdminRoutingModule } from './user-admin-routing.module';
import { UsersComponent } from './users/users.component';
import { RoleAndPermissionsComponent } from './role-and-permissions/role-and-permissions.component';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { DirectivesModule } from 'src/app/shared/directives/module';
import { SearchModule } from 'src/app/shared/search/search-module';
import { PaginatorModule } from 'src/app/shared/pagination/module';
import { NgbModule, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { UserformComponent } from './userform/userform.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SettingComponent } from './setting/setting.component';
import { HelpComponent } from './help/help.component';
// import { ExportCSVModule } from 'src/app/shared/export-csv/export-csv-module';
import { CardSettingsComponent } from './card-settings/card-settings.component';
import { GraphSettingsComponent } from './graph-settings/graph-settings.component';
import { AddGroupFormComponent } from './add-group-form/add-group-form.component';
import { AssignGroupFormComponent } from './assign-group-form/assign-group-form.component';
import { PasswordStrengthModule } from 'src/app/shared/password-strength/module';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { UserBulkUploadComponent } from './user-bulk-upload/user-bulk-upload.component';
import { GeneralFormModule } from 'src/app/shared/general-forms/module';
import { GraphsModule } from 'src/app/shared/graphs/graphs.module';
import { UserConfigurationComponent } from './user-configuration/user-configuration.component';
 



@NgModule({
  declarations: [
    UsersComponent,
    RoleAndPermissionsComponent,
    UserformComponent,
    UserProfileComponent,
    SettingComponent,
    CardSettingsComponent,
    GraphSettingsComponent,
    AddGroupFormComponent,
    AssignGroupFormComponent,
    UserBulkUploadComponent,
    UserConfigurationComponent,
   
  ],
  imports: [
    CommonModule,
    UserAdminRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgSelectModule,
    FlexLayoutModule,
    AngularDualListBoxModule,
    GeneralTableModule,
    DirectivesModule,
    BreadcrumbsModule,
    SearchModule,
    GeneralFormModule,
    PaginatorModule,
    NgbModule,
    FormsModule,
    PasswordStrengthModule,
    GraphsModule
    // ExportCSVModule
  ]
})
export class UserAdminModule { }
