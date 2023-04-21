import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedPipesModule } from "src/app/shared/Pipes/Pipes.module";
import { SearchComponent } from "./search.component";


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        SharedPipesModule,
    ],
    declarations: [
        SearchComponent,
    ],
    exports: [
        SearchComponent,
    ]
})
export class SearchModule { }