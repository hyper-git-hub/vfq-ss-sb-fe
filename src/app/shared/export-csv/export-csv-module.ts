import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ExportCsvComponent } from "./export-csv.component";


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FlexLayoutModule,
    ],
    declarations: [
        ExportCsvComponent,
    ],
    exports: [
        ExportCsvComponent,
    ]
})
export class ExportCSVModule { }