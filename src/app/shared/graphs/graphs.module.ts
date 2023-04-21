// import { RouterModule } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SimpleTreemapComponent } from './simple-treemap/simple-treemap.component';
import { SimplePieChartComponent } from './simple-pie-chart/simple-pie-chart.component';
import { StackColumnChartComponent } from './stack-column-chart/stack-column-chart.component';
import { HybridDrillDownChartComponent } from './hybrid-drill-down-chart/hybrid-drill-down-chart.component';
import { PictorialFractionChartComponent } from './pictorial-fraction-chart/pictorial-fraction-chart.component';
import { FunnelComponent } from './funnel/funnel.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { ColumnRotatedComponent } from './column-rotated/column-rotated.component';
import { CustomPictorialChartComponent } from './custom-pictorial-chart/custom-pictorial-chart.component';


@NgModule({
    declarations: [
        SimpleTreemapComponent,
        SimplePieChartComponent,
        StackColumnChartComponent,
        HybridDrillDownChartComponent,
        PictorialFractionChartComponent,
        FunnelComponent,
        PieChartComponent,
        ColumnRotatedComponent,
        CustomPictorialChartComponent,
    ],
    imports: [
        CommonModule,
        // RouterModule,
        FlexLayoutModule
    ],
    exports: [
        SimpleTreemapComponent,
        SimplePieChartComponent,
        StackColumnChartComponent,
        HybridDrillDownChartComponent,
        PictorialFractionChartComponent,
        FunnelComponent,
        PieChartComponent,
        ColumnRotatedComponent,
        CustomPictorialChartComponent
    ]
})
export class GraphsModule { }
