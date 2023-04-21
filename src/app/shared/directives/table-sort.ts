import { Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { SortDirection, SortEvent } from './models';

interface Country {
    id: number;
    name: string;
    flag: string;
    area: number;
    population: number;
}

const COUNTRIES: Country[] = [
    {
        id: 1,
        name: 'Russia',
        flag: 'f/f3/Flag_of_Russia.svg',
        area: 17075200,
        population: 146989754
    },
    {
        id: 2,
        name: 'Canada',
        flag: 'c/cf/Flag_of_Canada.svg',
        area: 9976140,
        population: 36624199
    },
    {
        id: 3,
        name: 'United States',
        flag: 'a/a4/Flag_of_the_United_States.svg',
        area: 9629091,
        population: 324459463
    },
    {
        id: 4,
        name: 'China',
        flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
        area: 9596960,
        population: 1409517397
    }
];

// export type SortColumn = keyof Country | '';
// export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

// export interface SortEvent {
//     column: SortColumn;
//     direction: SortDirection;
// }

@Directive({
    selector: 'th[sortable]',
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'rotate()'
    }
})
export class SortableTableHeader {
    @Input() sortable: any = '';
    @Input() direction: SortDirection = '';
    @Output() sort = new EventEmitter<SortEvent>();

    rotate() {
        this.direction = rotate[this.direction];
        console.log(this.sortable, this.direction);
        this.sort.emit({ column: this.sortable, direction: this.direction });
    }
}