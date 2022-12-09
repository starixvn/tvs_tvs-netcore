import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class CommonTimeModel {
    ngbDate: NgbDate;
    hour: string;
    minute: string;
    second: string;

    constructor(date: Date) {
        this.hour = this.insertZeroFirst(date.getHours());
        this.minute = this.insertZeroFirst(date.getMinutes());
        this.second = this.insertZeroFirst(date.getSeconds());
        this.ngbDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    insertZeroFirst(value: number) {
        const NUMBER_TEN = 10;
        return value < NUMBER_TEN ? `0${value}` : value.toString();
    }

    eventHour(event: KeyboardEvent) {
        this.hour = this.setValue(event);
    }

    eventMinute(event: KeyboardEvent) {
        this.minute = this.setValue(event);
    }

    eventSecond(event: KeyboardEvent) {
        this.second = this.setValue(event);
    }

    setValue(event: KeyboardEvent) {
        if (event.key === 'ArrowUp') {
            return this.arrowUp(event);
        } else if (event.key === 'ArrowDown') {
            return this.arrowDown(event);
        } else if ('0' <= event.key && event.key <= '9') {
            return this.pressNumber(event);
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
            event.preventDefault();
            return '00';
        } else {
            if (event.ctrlKey !== true && event.key !== 'c') {
                event.preventDefault();
            }

            return this.pressOthers(event);
        }
    }

    arrowUp(event: KeyboardEvent) {
        const eventTarget = event.target as HTMLInputElement;
        let value = parseInt(eventTarget.value, 10) + 1;
        value = value > parseInt(eventTarget.max, 10) ? parseInt(eventTarget.min, 10) : value;
        return this.insertZeroFirst(value);
    }

    arrowDown(event: KeyboardEvent) {
        const eventTarget = event.target as HTMLInputElement;
        let value = parseInt(eventTarget.value, 10) - 1;
        value = value < parseInt(eventTarget.min, 10) ? parseInt(eventTarget.max, 10) : value;
        return this.insertZeroFirst(value);
    }

    pressNumber(event: KeyboardEvent) {
        const eventTarget = event.target as HTMLInputElement;
        const value = `${eventTarget.value.substr(1)}${event.key}`;
        return value > eventTarget.max ? `0${event.key}` : value;
    }

    pressOthers(event: KeyboardEvent) {
        const eventTarget = event.target as HTMLInputElement;
        return eventTarget.value;
    }
}
