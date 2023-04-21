import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalSearchBarModule } from 'src/app/platform/global-search-bar/global-search-bar.module';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    MainDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    NgbModule,
    GlobalSearchBarModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    MainDashboardComponent
  ]
})
export class MainDashboardModule { }
