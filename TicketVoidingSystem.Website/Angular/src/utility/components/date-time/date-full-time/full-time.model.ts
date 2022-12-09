import { CommonTimeModel } from '../common.time.model';

export class FullTime extends CommonTimeModel {
  millisecond: string;
  meridiem: string;

  constructor(date: Date) {
    super(date);
    this.init(date);
  }

  init(date: Date) {
    const TWELVE_HOURS = 12;
    let hours = date.getHours() % TWELVE_HOURS;
    hours = hours ? hours : TWELVE_HOURS;
    this.hour = this.insertZeroFirst(hours);
    this.millisecond = this.insertZeroMillisecond(date.getMilliseconds().toString());
    this.meridiem = date.getHours() < TWELVE_HOURS ? 'AM' : 'PM';
  }

  renderTime(data: string, ignoreMeridiem: boolean) {
    const HOUR_END_INDEX = 2;
    const MINUTE_START_INDEX = 3;
    const MINUTE_END_INDEX = 5;
    const SECOND_START_INDEX = 6;
    const SECOND_END_INDEX = 8;
    const MILLISECOND_START_INDEX = 9;
    const MILLISECOND_END_INDEX = 12;
    const MERIDIEM_START_INDEX = 13;
    const MERIDIEM_END_INDEX = 15;

    this.hour = data.substring(0, HOUR_END_INDEX);
    this.minute = data.substring(MINUTE_START_INDEX, MINUTE_END_INDEX);
    this.second = data.substring(SECOND_START_INDEX, SECOND_END_INDEX);
    this.millisecond = data.substring(MILLISECOND_START_INDEX, MILLISECOND_END_INDEX);
    this.meridiem = ignoreMeridiem ? this.meridiem : data.substring(MERIDIEM_START_INDEX, MERIDIEM_END_INDEX).toUpperCase();
  }

  eventMillisecond(event: KeyboardEvent) {
    this.millisecond = this.setValue(event);
    this.millisecond = this.insertZeroMillisecond(this.millisecond);
  }

  insertZeroMillisecond(value: string) {
    const TENS = 10;
    const HUNDREDS = 100;
    const temp = parseInt(value, 10);
    return temp < TENS ? `00${temp}` :
      temp < HUNDREDS ? `0${temp}` : temp.toString();
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
    } else {
      const value = `${this.ngbDate.year}/${this.ngbDate.month}/${this.ngbDate.day}` + ' ' +
        this.hour + ':' + this.minute + ':' + this.second + ' ' + this.meridiem;
      const TWELVE_HOURS = 12;
      const result = new Date(value);
      result.setSeconds(result.getSeconds() + 1);
      const month = result.getMonth() + 1;
      let hours = result.getHours() % TWELVE_HOURS;
      hours = hours ? hours : TWELVE_HOURS;
      const meridiem = result.getHours() < TWELVE_HOURS ? 'AM' : 'PM';
      return `${result.getFullYear()}/${month}/${result.getDate()}` + ' ' +
        `${hours}:${result.getMinutes()}:${result.getSeconds()}` + '.000' + ' ' + meridiem;
    }
  }

  roundUpMillisecond(): string {
    const APPEND_NUMBER = 2;
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
        return (parseInt(this.millisecond, 10) + APPEND_NUMBER).toString();
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
    return `${this.ngbDate.year}/${this.ngbDate.month}/${this.ngbDate.day}` + ' ' +
      this.hour + ':' + this.minute + ':' + this.second + '.' + millisecond + ' ' + this.meridiem;
  }

  getValue(): string {
    return `${this.ngbDate.year}/${this.ngbDate.month}/${this.ngbDate.day}` + ' ' +
      this.hour + ':' + this.minute + ':' + this.second + '.' + this.millisecond + ' ' + this.meridiem;
  }
}
