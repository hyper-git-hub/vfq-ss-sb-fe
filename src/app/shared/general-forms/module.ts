import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GeneralFormsComponent } from './general-forms.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarModule } from "primeng/calendar";


@NgModule({
    declarations: [
        GeneralFormsComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        CalendarModule,
        NgSelectModule,
        FlexLayoutModule,
    ],
    exports: [
        GeneralFormsComponent,
    ]
})
export class GeneralFormModule { }
