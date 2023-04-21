import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    @Input() title: string;
    @Input() cols: any[] = [];
    @Output() signal: EventEmitter<any>;

    searchControl: FormControl;
    expandSearch: boolean;
    data: any[];
    searchColumns: any[];
    columns: any[] = [];

    placeholder: string;
    @Input() showFilters: boolean = false;

    constructor() {
        this.title = 'Title';
        this.signal = new EventEmitter<any>();
        this.expandSearch = false;
        this.data = [];
        this.searchColumns = [];

        this.searchControl = new FormControl('');
        this.placeholder = 'Search here...';
    }

    ngOnInit(): void {
        for (let i=0; i < this.cols.length; i++)
        {
            this.data.push({id: i+1, column: this.cols[i], checked: false});
        }

        this.searchControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
            this.onSearch(value);
        });

        // this.data = [
        //     { id: 1, column: 'Name', checked: false },
        //     { id: 2, column: 'Group', checked: false },
        //     { id: 3, column: 'Email', checked: false },
        //     { id: 4, column: 'Status', checked: false },
        // ]
    }

    toggleSearchColumns() {
        this.expandSearch = !this.expandSearch;
    }

    onSearch(value: any, idx?: number) {
        setTimeout(() => {
            if (this.data.length > 0) {
                this.data.forEach((element, idx) => {
                    if (element.checked) {
                        if (!this.columns.includes(element.column)) {
                            this.columns.push(element.column);
                        }
                    } else {
                        let id = this.columns.findIndex(ele => {
                            return ele === element.column;
                        });
                        if (id !== -1) { this.columns.splice(id, 1); }
                    }
                });
    
                if (this.columns.length > 0) {
                    this.signal.emit({column: this.columns, search: value});
                } else {
                    this.signal.emit({column: 'all_columns', search: value });
                }
            }
        }, 100);
    }

    @HostListener("document:click", ["$event.target"])
    onClick(element: Element): void {
        if (!element.closest(".dv")) this.expandSearch = false;
    }
}
