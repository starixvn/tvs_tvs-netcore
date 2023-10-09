export class Time {
    hour: number;
    minute: number;
    second: number;

    constructor(date: Date) {
        this.hour = this.getValue(date.getHours());
        this.minute = this.getValue(date.getMinutes());
        this.second = this.getValue(date.getSeconds());
    }

    getValue(value: any) {
        return 0 <= value && value <= 9 ? '0' + value : value;
    }
}