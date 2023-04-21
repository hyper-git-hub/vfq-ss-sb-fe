import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatsIconCardComponent } from './stats-icon-card.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
    declarations: [
        StatsIconCardComponent,
    ],
    imports: [
        CommonModule,
        NgbModule    ],
    exports: [
        StatsIconCardComponent,
    ]
})
export class StatsIconsModule { }
