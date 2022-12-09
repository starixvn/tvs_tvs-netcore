import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CommonTimeModel } from '../common.time.model';

export class TimeModel extends CommonTimeModel {
  time: string;

  constructor(date: Date) {
    super(date);
  }

  getValue(): string {
    return `${this.ngbDate.year}/${this.ngbDate.month}/${this.ngbDate.day} ${this.hour}:${this.minute}:${this.second}`;
  }
}
