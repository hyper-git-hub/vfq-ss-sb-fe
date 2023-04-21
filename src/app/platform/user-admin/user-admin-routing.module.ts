import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardSettingsComponent } from './card-settings/card-settings.component';
import { GraphSettingsComponent } from './graph-settings/graph-settings.component';
import { HelpComponent } from './help/help.component';
import { RoleAndPermissionsComponent } from './role-and-permissions/role-and-permissions.component';
import { SettingComponent } from './setting/setting.component';
import { UserConfigurationComponent } from './user-configuration/user-configuration.component';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'role-permission', component: RoleAndPermissionsComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'configurations', component: UserConfigurationComponent },
  { path: 'setting', component: SettingComponent },
  { path: 'help', component: HelpComponent },
  { path: 'cards-setting', component: CardSettingsComponent },
  { path: 'graphs-setting', component: GraphSettingsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAdminRoutingModule { }
