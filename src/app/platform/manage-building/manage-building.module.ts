import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageBuildingRoutingModule } from './manage-building-routing.module';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { DirectivesModule } from 'src/app/shared/directives/module';
import { SearchModule } from 'src/app/shared/search/search-module';
import { PaginatorModule } from 'src/app/shared/pagination/module';
import { NgbModule, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ManagebuildingformComponent } from './managebuildingform/managebuildingform.component'
// import { ExportCSVModule } from 'src/app/shared/export-csv/export-csv-module';
import { BuildingComponent } from './building/building.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GeneralFormModule } from 'src/app/shared/general-forms/module';
import { BuildingDetailComponent } from './building-detail/building-detail.component';


@NgModule({
  declarations: [
    BuildingComponent,
    ManagebuildingformComponent,
    BuildingDetailComponent
  ],
  imports: [
    CommonModule,
    ManageBuildingRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule,
    FlexLayoutModule,
    GeneralTableModule,
    DirectivesModule,
    SearchModule,
    PaginatorModule,
    NgbModule,
    FormsModule,
    GeneralFormModule
    // ExportCSVModule
  ]
})
export class ManageBuildingModule { }
