import { Component, OnInit, Input, ElementRef } from '@angular/core';

import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { TEXT } from '../../shared/text';
import { FullTime } from './full-time.model';

@Component({
    selector: 'full-time',
    templateUrl: 'full-time.component.html',
    styleUrls: ['full-time.component.scss']
})

export class FullTimeComponent implements OnInit {
    @Input() model: FullTime;
    @Input() disabled: boolean;
    tooltip = new Tooltip;

    constructor(private element: ElementRef) {
        this.tooltip.element = this.element;
    }

    ngOnInit() {
        this.model = new FullTime(new Date());
    }

    eventPaste(event: ClipboardEvent) {
        const data = event.clipboardData.getData('text');
        if (data.length === 12 || data.length === 13) {
            this.model.renderTime(data, true);
            this.validate();
        }
        else if (data.length === 15) {
            this.model.renderTime(data, false);
            this.validate();
        }
        else {
            this.tooltip.display('time', 'Invalid Datetime format. The correct format is "HH:mm:ss.SSS AM/PM"');
        }
    }

    validate() {
        if (!this.isValidHour() || !this.isValidMinAndSecond(this.model.minute) ||
            !this.isValidMinAndSecond(this.model.second) || !this.isValidMillisecond() ||
            !this.isValidMeridiem()) {
            this.tooltip.display('time', 'Invalid Datetime format. The correct format is "HH:mm:ss.SSS AM/PM"');
            this.model.init(new Date());
        }
    }

    isValidHour(): boolean {
        const hour = parseInt(this.model.hour, 10);
        return this.isNumber(this.model.hour) && hour >= 1 && hour <= 12;
    }

    isValidMinAndSecond(value: string): boolean {
        const valueNum = parseInt(value, 10);
        return this.isNumber(value) && valueNum >= 0 && valueNum <= 59;
    }

    isValidMillisecond(): boolean {
        const millisecond = parseInt(this.model.millisecond, 10);
        return this.isNumber(this.model.millisecond) && millisecond >= 0 && millisecond <= 999;
    }

    isValidMeridiem(): boolean {
        return this.model.meridiem === 'AM' || this.model.meridiem === 'PM';
    }

    isNumber(value: string): boolean {
        return /^\+?([0-9]\d*)$/.test(value);
    }
}