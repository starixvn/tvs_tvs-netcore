import { Component, OnInit, Input } from '@angular/core';

import { Time } from './time.model';

@Component({
    selector: 'time',
    templateUrl: 'time.component.html',
    styleUrls: ['time.component.scss']
})

export class TimeComponent implements OnInit {
    @Input() time: Time;
    @Input() disabled: boolean;

    ngOnInit() {
        this.time = new Time(new Date());
    }

    onKey(event: KeyboardEvent) {
        if (event.key === 'ArrowUp') {
            this.arrowUp(event);
        } else if (event.key === 'ArrowDown') {
            this.arrowDown(event);
        } else if ('0' <= event.key && event.key <= '9') {
            this.pressNumber(event);
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
            this.removeNumber(event.key);
        }
    }

    arrowUp(event: any) {
        const value = parseInt(event.target.value, 10) + 1;
        let newValue = value > event.target.max ? event.target.min : value;
        newValue = this.time.getValue(newValue);
        this.changeValueTime(event, newValue);
    }

    arrowDown(event: any) {
        const value = parseInt(event.target.value, 10) - 1;
        let newValue = value < event.target.min ? event.target.max : value;
        newValue = this.time.getValue(newValue);
        this.changeValueTime(event, newValue);
    }

    pressNumber(event: any) {
        let newValue = event.target.value % 10 + event.key;
        newValue = newValue > event.target.max ? '0' + event.key : newValue;
        this.changeValueTime(event, newValue);
    }

    removeNumber(key: string) {
        key === 'Backspace' ? this.changeValueTime(event, '000') : this.changeValueTime(event, '00');
    }

    changeValueTime(event: any, newValue: any) {
        if (event.target.classList.contains('hour')) {
            this.time.hour = newValue;
        }
        if (event.target.classList.contains('minute')) {
            this.time.minute = newValue;
        }
        if (event.target.classList.contains('second')) {
            this.time.second = newValue;
        }
    }
}