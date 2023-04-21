import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from 'src/app/services/api.service';

import { TableAction, TableColumn, TableConfig, TableRowAction } from './model';
import { SortEvent } from '../directives/models';
import { SortableTableHeader } from '../directives/table-sort';
import { DownloadFileComponent } from '../download-file/download-file.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FORMATS } from './formats';
import { SearchComponent } from '../search/search.component';
import { ApiResponse } from 'src/app/interfaces/response';
import { FormControl } from '@angular/forms';


@Component({
    selector: 'general-table',
    templateUrl: './general-table.component.html',
    styleUrls: ['./general-table.component.scss']
})
export class GeneralTableComponent implements OnInit, OnDestroy, OnChanges {

    @ViewChildren(SortableTableHeader) headers!: QueryList<SortableTableHeader>;
    @ViewChildren(SearchComponent) searchControl!: QueryList<SearchComponent>;

    @Input() config: TableConfig;
    @Input() dataSource: any[];
    @Input() count: number;
    @Input() actions: Subject<TableAction>;
    @Input() urlFilters: any;
    @Input() pageInfo: any;

    @Output() signals = new EventEmitter<any>();

    searchCon: FormControl;


    loading: boolean;
    readonly: boolean;
    directDownload: boolean;
    btnStatus: boolean;


    limit: number;
    offset: number;

    search: any;
    sorting: any;
    sorting2: any;
    data: any[];
    filters: any;
    allSelected: any;
    selectedRows: any[];

    slug: string;
    exportUrl: string;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService,
        private modal: NgbModal
    ) {
        this.actions = new Subject<TableAction>();
        this._unsubscribeAll = new Subject();
        this.config = new TableConfig(null);
        this.loading = false;
        const user: any = JSON.parse(localStorage.getItem('user'));
        this.readonly = user.write ? false : true;
        this.directDownload = true;
        this.btnStatus = false;

        this.searchCon = new FormControl('');



        this.count = 0;
        this.limit = 10;
        this.offset = 0;

        this.slug = '';
        this.exportUrl = '';

        this.search = { search_with: '', search_text: '' };
        this.sorting = { column: '', direction: '' };
        this.sorting2 = { column: '', direction: '' };
        this.filters = null;
        this.urlFilters = null;
        this.pageInfo = { pageIndex: 0, pageSize: 10, offset: 0 };

        this.dataSource = [];
        this.data = [];
        this.selectedRows = [];
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.dataSource) {
            this.dataSource = changes.dataSource.currentValue;
        }

        if (changes.count) {
            this.count = changes.count.currentValue;
        }

        if (changes.urlFilters) {
            this.urlFilters = null;
            this.urlFilters = changes.urlFilters.currentValue;
        }
    }

    ngOnInit(): void {

        this.slug = `${this.config.slug}`;
        this.exportUrl = `${this.config.slug}`;
        let limit = localStorage.getItem('limit');
        if (limit) {
            this.limit = +limit;
        }

        // if (this.config.selectionEnabeled)
        // {
        //     this.config.columns.unshift('selection');
        // }

        this.count = this.dataSource?.length;
        if (this.config.doApiCall) {
            this.doApiCall();
        }

        if (!!this.actions) {
            this.actions.pipe(takeUntil(this._unsubscribeAll)).subscribe((e: TableAction) => {
                this.handleTableAction(e);
            });
        }

        this.searchCon.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
            if (this.config.searchInSide) {
                this.urlFilters[this.config.searchKey] = value;
                this.pageInfo = { pageIndex: 0, pageSize: 10, offset: 0 };
                this.urlFilters['limit'] = this.pageInfo.pageSize;
                this.urlFilters['offset'] = '0';
                this.doApiCall();
            } else {
                this.signals.emit({ type: 'searchTable', data: value });
            }
        });
    }

    handleTableAction(e: TableAction) {
        switch (e.action) {
            case 'reload':
                if (this.config.doApiCall) {
                    this.doApiCall();
                }
                break;
            case 'loadingTrue':
                this.loading = true;
                break;
            case 'loadingFalse':
                this.loading = false;
                break;
            case 'search':
                const ev = { column: 'all_columns', search: e.row };
                this.onSearch(ev);
                this.searchControl.first.searchControl.setValue(e.row);
                break;
            case 'search-report':
                const eve = { column: 'gate_name', search: e.row };
                this.onSearch(eve);
                // this.searchControl.first.onSelectColumn({id: 1, column: 'gate_name', title: 'Gate', checked: false}, 0);
                this.searchControl.first.searchControl.setValue(e.row);
                break;
            case 'filter':
                this.onFilters(e.row);
                this.filters = e.row;
                break;
            case 'clear-selection':
                this.selectedRows = [];
                this.allSelected = false;
                break;
            case 'reset-pagination':
                this.pageInfo.offset = 0;
                break;
            case 'setBtnStatus':
                // this.btnStatus = e.row;
                let idx = this.dataSource.findIndex(ele => {
                    return ele.device === e.row['device'];
                });
                this.dataSource.splice(idx, 1, e.row);
                break;
            case 'reset-filters':
                this.urlFilters = e.row;
                break;
            case 'reset-search':
                this.searchCon.setValue('');
                this.urlFilters['search'] = '';
                break;
        }
    }

    doApiCall(ev?: any) {
        this.loading = true;
        this.directDownload = false;
        if (!!this.urlFilters) {
            let url = new URL(`${this.config.slug}`);
            for (const key in this.urlFilters) {
                if (!!this.urlFilters[key]) {
                    url.searchParams.set(key, this.urlFilters[key]);
                }
            }

            this.slug = url.href;
            this.exportUrl = url.href;
            this.exportUrl += '&';
        } else {
            if (!!ev && !!ev.filter) {
                this.slug = `${this.config.slug}search_with=${ev.search_with}&search_text=${ev.search_text}&order_by=${ev.column}&order=${ev.direction}&offset=${this.offset}&limit=${this.limit}&${ev.filter}`;
            } else if (!!ev) {
                this.slug = `${this.config.slug}search_with=${ev.search_with}&search_text=${ev.search_text}&order_by=${ev.column}&order=${ev.direction}&offset=${this.offset}&limit=${this.limit}`;
            } else {
                this.slug = `${this.config.slug}offset=${this.offset}&limit=${this.limit}`;
            }
        }
        // this.slug = !!ev ? `${this.config.slug}search_with=${ev.search_with}&search_text=${ev.search_text}&order_by=${ev.column}&order=${ev.direction}&offset=${this.offset}&limit=${this.limit}&${ev.filter}` :
        //     `${this.config.slug}offset=${this.offset}&limit=${this.limit}`;

        this.apiService.get(this.slug).subscribe((resp: ApiResponse) => {
            this.loading = false;
            let data = resp.data;

            if (this.config.respOutside) {
                this.signals.emit({ type: 'onData', data: data });
            } else {
                this.data = resp.data['data'] ? resp.data['data'] : resp.data ? resp.data : [];
                this.dataSource = data['data'] ? data['data'] : data ? data : [];
                this.count = data['count'] || data.length;
                this.signals.emit({ type: 'onData', data: data });

                if (this.sorting2.column && this.sorting2.direction) {
                    let dt = this.dataSource;
                    if (this.sorting2.direction === 'asc') {
                        this.dataSource = dt.sort((a, b) => a[this.sorting2.column] - b[this.sorting2.column])
                    } else if (this.sorting2.direction === 'desc') {
                        this.dataSource = dt.sort((a, b) => b[this.sorting2.column] - a[this.sorting2.column])
                    }
                }
            }

            if (!!ev && ev.search_with !== 'all_columns' && !!ev.search_text && this.dataSource.length > 0) {
                this.config.showSearchFilters = true;
            } else {
                this.config.showSearchFilters = false;
            }
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error getting data', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onRowAction(action: TableRowAction, row?: any) {
        const ac = { type: action.action, row: row };
        this.signals.emit(ac);
    }

    onCellClick(row: any, column: any): void {
        const ac = { type: column.action, row: row };
        this.signals.emit(ac);
    }

    onAddNew(): void {
        const d = { type: 'OpenForm' };
        this.signals.emit(d);
    }

    onOptionalBtn(): void {
        this.signals.emit({ type: 'onOptionalBtn' });
    }

    onDownload(): void {
        const options: NgbModalOptions = { size: 'md' };
        const modalRef = this.modal.open(DownloadFileComponent, options);

        modalRef.componentInstance.slug = this.slug;
        modalRef.componentInstance.directDownload = this.directDownload;
        modalRef.componentInstance.fileName = this.config.title + ' List';
    }


    onSort({ column, direction }: SortEvent, col?: TableColumn): void {
        // resetting other headers
        this.headers.forEach(header => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });
        const dt = this.dataSource;
        if (col?.sortableFromView) {
            this.sorting2 = { column: column, direction: direction };
            if (direction === 'asc') {
                this.dataSource = dt.sort((a, b) => a[col.name] - b[col.name])
            } else if (direction === 'desc') {
                this.dataSource = dt.sort((a, b) => b[col.name] - a[col.name])
            } else {
                this.sorting = { search_with: this.search.search_with, search_text: this.search.search_text, column: '', direction: '' };
                this.doApiCall(this.sorting);
            }
        } else {
            this.sorting = { search_with: this.search.search_with, search_text: this.search.search_text, column: column, direction: direction };
            if (col.sortingOutside) {
                if (this.config.multiSort) {
                    const sorti = this.sorting;
                    sorti['cols'] = this.config.columns;
                    this.signals.emit({ type: 'onSorting', data: sorti });
                } else {
                    this.signals.emit({ type: 'onSorting', data: this.sorting });
                }
            } else {
                if (this.filters) {
                    this.sorting['filter'] = this.filters;
                }
                if (this.urlFilters) {
                    this.urlFilters.order = direction;
                    this.urlFilters.order_by = column;
                }
                this.doApiCall(this.sorting);
            }
        }
    }

    onSearch(ev: any): void {
        console.log(ev)
        this.search = { search_with: ev.column, search_text: ev.search, column: this.sorting.column, direction: this.sorting.direction };
        if (this.filters) {
            this.search['filter'] = this.filters;
        }
        this.pageInfo = { pageIndex: 0, pageSize: 10, offset: 0 };
        this.search.offset = '0';
        this.search.limit = this.pageInfo.pageSize;
        this.doApiCall(this.search);
    }

    onPageChange(event: any): void {
        this.offset = event.offset;
        this.limit = event.pageSize;
        let ev: any = { search_with: this.search.search_with, search_text: this.search.search_text, column: this.sorting.column, direction: this.sorting.direction }
        if (!this.config.paginationOutside) {
            if (this.filters) {
                ev.filter = this.filters;
            }
            if (this.urlFilters) {
                this.urlFilters.offset = event.offset;
                this.urlFilters.limit = event.pageSize;
            }
            this.doApiCall(ev);
        } else {
            const pageEvent = { search_with: this.search.search_with, search_text: this.search.search_text, column: this.sorting.column, direction: this.sorting.direction, offset: (this.offset).toString(), limit: this.limit };
            this.signals.emit({ type: 'onPagination', data: pageEvent });
        }
    }

    onFilters(filter: any) {
        let ev = { search_with: this.search.search_with, search_text: this.search.search_text, column: this.sorting.column, direction: this.sorting.direction, filter: filter };
        this.doApiCall(ev);
    }

    cellValue(col: TableColumn, row: any) {
        if (!col.format) {
            if (col.obj_item) {
                const obj = col.obj_item;
                return row[col.name][obj];
            } else {
                return col.value ? col.value : row[col.name] === 0 ? '0' : !row[col.name] ? '-' : row[col.name];
                // return row[col.name] === 0 ? '0' : row[col.name] === true ? 'ON' : row[col.name] === false ? 'OFF' : row[col.name]  ? row[col.name] : '-';
            }
        } else {
            return FORMATS[col.format](row[col.name], row, col);
        }
    }

    onMasterToggle() {
        this.selectedRows = [];
        this.dataSource.forEach(element => {
            if (!this.allSelected) {
                element.selected = false;
                this.selectedRows = [];
            } else {
                element.selected = true;
                this.selectedRows.push(element);
            }
        });

        this.signals.emit({ type: 'selected-all', data: this.selectedRows });
    }

    onSelectDevice(item: any) {
        if (item.selected) {
            this.selectedRows.push(item);
        } else {
            let indx = this.selectedRows.findIndex(ele => {
                return item.id === ele.id;
            });
            this.selectedRows.splice(indx, 1);
        }
        this.signals.emit({ type: 'selected', data: this.selectedRows });

        const tr = this.dataSource.length;
        const sr = this.selectedRows.length;
        this.allSelected = sr === tr;
    }

    onDownloadSignal(ev: any) {
        this.signals.emit(ev);
    }

    ngOnDestroy(): void {
        if (this._unsubscribeAll != null) {
            this._unsubscribeAll.next(null);
            this._unsubscribeAll.complete();
        }
    }

    onCheckStatus(ev: any, column: any, row: any) {
        this.signals.emit({ type: column.action, data: ev.target['checked'], row: row });
    }

}
