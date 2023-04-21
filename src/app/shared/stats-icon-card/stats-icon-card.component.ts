import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-stats-icon-card',
    templateUrl: './stats-icon-card.component.html',
    styleUrls: ['./stats-icon-card.component.scss']
})
export class StatsIconCardComponent {

    @Input() data: any[];

    @Input() icon?: string;
    @Input() count?: string;
    @Input() label?: string;

    @Input() cardHeight?: string;
    @Input() showIconBadge?: boolean;
    @Input() bgStyle?: string;
    @Input() textClass?: string;
    @Input() textCase?: string;
    @Input() fontSize?: string;
    @Input() footerFontSize?: string;

    @Output() onClick = new EventEmitter();

    colMd;

    constructor() {
        this.data = [];

        this.showIconBadge = true;
        this.icon = '';
        this.count = '';
        this.label = '';
        this.bgStyle = '#E60000';

        this.cardHeight = 'h-90';
        this.textClass = 'text-right';
        this.textCase = 'text-capitalize';
        this.fontSize = 'fs-24';
        this.footerFontSize = 'fs-14';
    }

    onCardClick() {
        this.onClick.emit({type: this.label});
    }
}
