import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveillanceRoutingModule } from './surveillance-routing.module';
import { LiveFeedComponent } from './live-feed/live-feed.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlayBackComponent } from './play-back/play-back.component';
import { GeozoneComponent } from './geozone/geozone.component';
import { NgbModule, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { DirectivesModule } from 'src/app/shared/directives/module';
import { SearchModule } from 'src/app/shared/search/search-module';
import { PaginatorModule } from 'src/app/shared/pagination/module';
import { GeozoneformComponent } from './geozoneform/geozoneform.component';
import { BreadcrumbsModule } from 'src/app/shared/breadcrumbs/breadcrumbs.module';
import { HttpClientModule } from '@angular/common/http';
import { ExportCSVModule } from 'src/app/shared/export-csv/export-csv-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LivefeedformComponent } from './livefeedform/livefeedform.component';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { GeneralFormModule } from 'src/app/shared/general-forms/module';
import { FileSaverModule } from 'ngx-filesaver';
import { ManageCamerasComponent } from './manage-cameras/manage-cameras.component';
import { ManagecameraformComponent } from './managecameraform/managecameraform.component';
import { SingleLiveCameraComponent } from './single-live-camera/single-live-camera.component';
import { DeviceFilterModule } from "../../shared/device-filter/device-filter.module";
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    LiveFeedComponent,
    PlayBackComponent,
    GeozoneComponent,
    GeozoneformComponent,
    LivefeedformComponent,
    ManageCamerasComponent,
    ManagecameraformComponent,
    SingleLiveCameraComponent,
  ],
  imports: [
    CommonModule,
    SurveillanceRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BreadcrumbsModule,
    NgSelectModule,
    FlexLayoutModule,
    FormsModule,
    NgbModule,
    GeneralTableModule,
    DirectivesModule,
    SearchModule,
    PaginatorModule,
    ExportCSVModule,
    VgStreamingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    GeneralFormModule,
    FileSaverModule,
    DeviceFilterModule,
    CalendarModule,
  ],


})
export class SurveillanceModule { }
