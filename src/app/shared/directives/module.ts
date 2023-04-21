import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import { DialogHeaderModule } from "../dialog-header/dialog-header-module";
import { SortableTableHeader } from "./table-sort";


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FlexLayoutModule,
    ],
    declarations: [
        SortableTableHeader
    ],
    exports: [
        SortableTableHeader
    ]
})
export class DirectivesModule { }