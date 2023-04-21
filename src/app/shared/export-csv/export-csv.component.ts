import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-export-csv',
    templateUrl: './export-csv.component.html',
    styleUrls: ['./export-csv.component.scss']
})
export class ExportCsvComponent implements OnInit {

    @Input() exportOutside: boolean;
    @Input() slug: string;
    directDownload: boolean;
    @Input() fileName: string;

    @Output() signals: EventEmitter<any>;

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService
    ) {
        this.slug = '';
        this.fileName = '';
        this.directDownload = false;
        this.exportOutside = false;

        this.signals = new EventEmitter();
    }

    ngOnInit(): void {
    }

    onDownload(type: string) {
        const url = this.directDownload ? `${this.slug}export=${type}` : `${this.slug}export=${type}`;
        if (this.exportOutside) {
            this.signals.emit({type: 'onDownload', data: type});
        } else {
            this.apiService.getExportXlsPdf(url).subscribe((resp: any) => {
                if (type === 'pdf') {
                    this.downloadPdf(resp);
                }
                else {
                    this.downloadCSV(resp);
                }
            }, (err => {
                this.toastrService.error(err.error['message'], 'Error', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }));
        }
    }

    downloadPdf(resp: any) {
        const data = resp;
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob)

        let fileLink = document.createElement('a');
        fileLink.href = url
        fileLink.download = this.fileName
        fileLink.click();
    }

    downloadCSV(resp: any) {
        const data = resp;
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob)

        let fileLink = document.createElement('a');
        fileLink.href = url
        fileLink.download = this.fileName
        fileLink.click();
    }

}
