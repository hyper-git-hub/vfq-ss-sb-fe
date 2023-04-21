import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";

import { DirectivesModule } from "src/app/shared/directives/module";
import { PaginatorModule } from "src/app/shared/pagination/module";
import { SearchModule } from "src/app/shared/search/search-module";
import { DownloaderModule } from "../download-file/download-file-module";
import { ExportCSVModule } from "../export-csv/export-csv-module";
import { GeneralTableComponent } from "./general-table.component";



@NgModule({
    declarations: [
        GeneralTableComponent,
    ],
    imports: [
        CommonModule,
        NgbModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,

        DirectivesModule,
        PaginatorModule,

        NgSelectModule,
        ExportCSVModule,
        DownloaderModule,
        SearchModule,
    ],
    exports: [
        GeneralTableComponent
    ]
})
export class GeneralTableModule { }