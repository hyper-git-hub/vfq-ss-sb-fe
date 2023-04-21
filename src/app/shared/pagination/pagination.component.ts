import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { ApiService } from 'src/app/services/api.service';

interface PageInfo {
    pageIndex: number;
    pageSize: number;
    offset: number;
}

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {

    @Input() pageInfo: PageInfo;
    @Input() length: number;
    totalPages: number;
    showedEntries: number;
    @Output() pageChange: EventEmitter<any>;
    apiService: any;
    toastrService: any;

    constructor(
        // private apiService: ApiService,
        // private toastrService: ToastrService
    ) {
        this.length = 0;
        this.showedEntries = 0;
        this.totalPages = 0;
        this.pageInfo = { pageIndex: 0, pageSize: 10, offset: 0 };
        this.pageChange = new EventEmitter();
    }

    ngOnInit(): void {
        let limit = localStorage.getItem('limit');
        if (limit) {
            this.pageInfo.pageSize = +limit;
            this.totalPages = Math.ceil(this.length / this.pageInfo.pageSize);
            this.calculateRecords();
        } else {
            this.totalPages = Math.ceil(this.length / this.pageInfo.pageSize);
            this.calculateRecords();
            // this.getPaginationSettings();
        }
    }

    // getPaginationSettings() {
    //     // const slug = `cobnewuserms/setting/pagination-setting/?id=1`;

    //     this.apiService.get(slug).subscribe((resp: any) => {
    //         let limit = resp.data['data']['item_per_page'];
    //         this.pageInfo.pageSize = +limit;
    //         localStorage.setItem('limit', limit);
    //         this.totalPages = Math.ceil(this.length / this.pageInfo.pageSize);
    //         this.calculateRecords();
    //     }, (err: any) => {
    //         this.toastrService.error(err.error['message'], 'Error getting pagination settings', {
    //             progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
    //         });
    //     });
    // }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.length) {
            this.length = changes.length.currentValue;
            this.totalPages = Math.ceil(this.length / this.pageInfo.pageSize);
        }

        this.calculateRecords();
    }

    calculateRecords() {
        this.showedEntries = (this.pageInfo.pageSize + this.pageInfo.offset) > this.length ? this.length : this.pageInfo.pageSize + this.pageInfo.offset;
    }

    onPrevious() {
        if (this.pageInfo.pageIndex <= 0) return;
        this.pageInfo.pageIndex -= 1;
        this.pageInfo.offset -= this.pageInfo.pageSize;
        this.calculateRecords();
        this.pageChange.emit(this.pageInfo);
    }

    onNext() {
        if (this.totalPages === 0 || this.pageInfo.pageIndex + 1 === this.totalPages) return;
        this.pageInfo.pageIndex++;
        console.log(this.pageInfo.pageSize, this.pageInfo.offset);
        this.pageInfo.offset += this.pageInfo.pageSize;
        console.log(this.pageInfo.pageSize, this.pageInfo.offset);
        this.calculateRecords();
        this.pageChange.emit(this.pageInfo);
    }

}
