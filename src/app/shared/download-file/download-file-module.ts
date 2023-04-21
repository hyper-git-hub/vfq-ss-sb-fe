import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import { DialogHeaderModule } from "../dialog-header/dialog-header-module";
import { DownloadFileComponent } from "./download-file.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        FlexLayoutModule,
        // DialogHeaderModule,
    ],
    declarations: [
        DownloadFileComponent,
    ],
    exports: [
        DownloadFileComponent,
    ]
})
export class DownloaderModule { }