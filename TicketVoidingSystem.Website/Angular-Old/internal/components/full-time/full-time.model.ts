export class FullTime {
    date: Date;
    hour: string;
    minute: string;
    second: string;
    millisecond: string;
    meridiem: string;

    constructor(date: Date) {
        this.init(date);
    }

    init(date: Date) {
        this.date = date;
        let hours = date.getHours() % 12;
        hours = hours ? hours : 12;
        this.hour = this.insertZeroFirst(hours);
        this.minute = this.insertZeroFirst(date.getMinutes());
        this.second = this.insertZeroFirst(date.getSeconds());
        this.millisecond = this.insertZeroMillisecond(date.getMilliseconds());
        this.meridiem = date.getHours() < 12 ? 'AM' : 'PM';
    }

    renderTime(data: string, ignoreMeridiem: boolean) {
        this.hour = data.substring(0, 2);
        this.minute = data.substring(3, 5);
        this.second = data.substring(6, 8);
        this.millisecond = data.substring(9, 12);
        this.meridiem = ignoreMeridiem ? this.meridiem : data.substring(13, 15).toUpperCase();
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

    eventMillisecond(event: KeyboardEvent) {
        this.millisecond = this.setValue(event);
        this.millisecond = this.insertZeroMillisecond(this.millisecond);
    }

    insertZeroFirst(value: any) {
        return parseInt(value, 10) < 10 ? '0' + value : value;
    }

    insertZeroMillisecond(value: any) {
        const temp = parseInt(value, 10);
        return temp < 10 ? '00' + temp :
            temp < 100 ? '0' + temp : temp.toString();
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
        }
        else {
            if (event.ctrlKey !== true && event.key !== 'c') {
                event.preventDefault();
            }

            return this.pressOthers(event);
        }
    }

    arrowUp(event: any) {
        let value = parseInt(event.target.value, 10) + 1;
        value = value > event.target.max ? event.target.min : value;
        return this.insertZeroFirst(value);
    }

    arrowDown(event: any) {
        let value = parseInt(event.target.value, 10) - 1;
        value = value < event.target.min ? event.target.max : value;
        return this.insertZeroFirst(value);
    }

    pressNumber(event: any) {
        const value = event.target.value.substr(1) + event.key;
        return value > event.target.max ? '0' + event.key : value;
    }

    pressOthers(event: any) {
        return event.target.value;
    }

    eventMeridiem(event: KeyboardEvent) {
        if (event.ctrlKey !== true && event.key !== 'c') {
            event.preventDefault();
        }

        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
                this.meridiem = this.meridiem === 'AM' ? 'PM' : 'AM';
                break;
            case 'a':
            case 'A':
                this.meridiem = 'AM';
                break;
            case 'p':
            case 'P':
                this.meridiem = 'PM';
                break;
            default:
                break;
        }
    }

    roundUp(): string {
        const millisecond = this.roundUpMillisecond();
        if (millisecond !== '1000') {
            return this.getValueWithMilliseconds(millisecond);
        }
        else {
            const temp = new Date(this.date);
            const tempmonth = temp.getMonth() + 1;
            const value = temp.getFullYear() + '/' + tempmonth + '/' + temp.getDate() + ' ' +
                this.hour + ':' + this.minute + ':' + this.second + ' ' + this.meridiem;

            const result = new Date(value);
            result.setSeconds(result.getSeconds() + 1);
            const month = result.getMonth() + 1;
            let hours = result.getHours() % 12;
            hours = hours ? hours : 12;
            const meridiem = result.getHours() < 12 ? 'AM' : 'PM';
            return result.getFullYear() + '/' + month + '/' + result.getDate() + ' ' +
                hours + ':' + result.getMinutes() + ':' + result.getSeconds() + '.000' + ' ' + meridiem;
        }
    }

    roundUpMillisecond(): string {
        const last = this.millisecond.slice(-1);
        switch (last) {
            case '1':
            case '2':
                return this.millisecond.slice(0, -1) + '3';
            case '4':
            case '5':
            case '6':
                return this.millisecond.slice(0, -1) + '7';
            case '8':
                return (parseInt(this.millisecond, 10) + 2).toString();
            case '9':
                return (parseInt(this.millisecond, 10) + 1).toString();
            default:
                return this.millisecond;
        }
    }

    roundDown(): string {
        const millisecond = this.roundDownMillisecond();
        return this.getValueWithMilliseconds(millisecond);
    }

    roundDownMillisecond() {
        const last = this.millisecond.slice(-1);
        switch (last) {
            case '1':
            case '2':
                return this.millisecond.slice(0, -1) + '0';
            case '4':
            case '5':
            case '6':
                return this.millisecond.slice(0, -1) + '3';
            case '8':
            case '9':
                return this.millisecond.slice(0, -1) + '7';
            default:
                return this.millisecond;
        }
    }

    private getValueWithMilliseconds(millisecond: string): string {
        const temp = new Date(this.date);
        const year = temp.getFullYear();
        const month = temp.getMonth() + 1;
        const day = temp.getDate();
        return year + '/' + month + '/' + day + ' ' +
            this.hour + ':' + this.minute + ':' + this.second + '.' + millisecond + ' ' + this.meridiem;
    }

    getValue(): string {
        const temp = new Date(this.date);
        const year = temp.getFullYear();
        const month = temp.getMonth() + 1;
        const day = temp.getDate();
        return year + '/' + month + '/' + day + ' ' +
            this.hour + ':' + this.minute + ':' + this.second + '.' + this.millisecond + ' ' + this.meridiem;
    }
}