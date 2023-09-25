import { Component, Input } from '@angular/core';

import { Tooltip } from './tooltip';

@Component({
    selector: 'tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: [
        'tooltip.component.scss'
    ],
    host: {
        '(document:mousedown)': 'onClick()'
    }
})

export class TooltipComponent {
    @Input() tooltip: Tooltip;

    onClick() {
        this.tooltip.show = false;
    }
}