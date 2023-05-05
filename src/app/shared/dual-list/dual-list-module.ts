import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DualListComponent } from "./dual-list.component";
import { NgSelectModule } from "@ng-select/ng-select";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        FlexLayoutModule,
        NgSelectModule, 
        ReactiveFormsModule
    ],
    declarations: [
        DualListComponent,
    ],
    exports: [
        DualListComponent,
    ]
})
export class DualListModule { }