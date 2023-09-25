import { Injectable } from '@angular/core';
import { Time } from '../components/time/time.model';

@Injectable()
export class DateTimeService {
    get(date: Date, time: Time): string {
        const temp = new Date(date);
        const year = temp.getFullYear();
        const month = temp.getMonth() + 1;
        const day = temp.getDate();
        const hour = this.getValue(time.hour);
        const minute = this.getValue(time.minute);
        const second = this.getValue(time.second);
        return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    }

    private getValue(value: number): string {
        if (value.toString() === '') {
            return '00';
        }
        else if (value.toString().length === 1) {
            return '0' + value;
        }
        else {
            return value.toString();
        }
    }
}