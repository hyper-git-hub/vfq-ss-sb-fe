import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrService } from 'ngx-toastr';
// import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-download-file',
    templateUrl: './download-file.component.html',
    styleUrls: ['./download-file.component.scss']
})
export class DownloadFileComponent implements OnInit {

    data: any;
    @Input() slug: string;
    @Input() fileName: string;
    @Input() directDownload: boolean;

    constructor(
        private modalRef: NgbActiveModal,
        // private apiService: ApiService,
        // private toastrService: ToastrService
    ) {
        this.data = null;
        this.slug = '';
        this.fileName = '';
        this.directDownload = false;
    }

    ngOnInit(): void {
    }

    // onDownload(type: string) {
    //     const url = this.directDownload ? `${this.slug}?export=${type}` : `${this.slug}&export=${type}`;
    //     this.apiService.getExportXlsPdf(url).subscribe((resp: any) => {
    //         // this.groups = resp.data;
    //         if (type === 'pdf') {
    //             this.downloadPdf(resp);
    //         }
    //         else {
    //             this.downloadCSV(resp);
    //         }
    //         this.modalRef.close();
    //     }, (err => {
    //         this.toastrService.error(err.error['message'], 'Error', {
    //             progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
    //         });
    //     }));
    // }

    // onCloseModal(ev: any) {
    //     ev.close();
    // }

    // downloadPdf(resp: any) {
    //     const data = resp;
    //     const blob = new Blob([data], { type: 'application/pdf' });
    //     const url = window.URL.createObjectURL(blob)

    //     let fileLink = document.createElement('a');
    //     fileLink.href = url
    //     fileLink.download = this.fileName
    //     fileLink.click();
    // }

    // downloadCSV(resp: any) {
    //     const data = resp;
    //     const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    //     const url = window.URL.createObjectURL(blob)

    //     let fileLink = document.createElement('a');
    //     fileLink.href = url
    //     fileLink.download = this.fileName
    //     fileLink.click();
    // }

}
