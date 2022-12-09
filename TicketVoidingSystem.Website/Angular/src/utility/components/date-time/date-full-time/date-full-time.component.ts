import { Tooltip } from '../../tooltip/tooltip.model';
import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

import { FullTime } from './full-time.model';

import * as _ from 'lodash';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'date-full-time',
  templateUrl: './date-full-time.component.html',
  styleUrls: ['./date-full-time.component.scss']
})
export class DateFullTimeComponent implements OnInit {
  @Input() model = new FullTime(new Date());
  @Input() disabled: boolean;
  @Input() minDate: NgbDate;
  @Input() maxDate: NgbDate;
  @Output() modelChange = new EventEmitter<FullTime>();
  tooltip = new Tooltip();

  constructor(private readonly element: ElementRef) {
    this.tooltip.element = this.element;
  }

  ngOnInit() {
    if (_.isNaN(this.model.hour)) {
      this.model = new FullTime(new Date());
    }
  }

  eventPaste(event: ClipboardEvent) {
    const MAX_LENGTH_TIMEFORMAT_HUNDREDTHS_SECOND = 12;
    const MAX_LENGTH_TIMEFORMAT_THOUSANDTHS_SECOND = 13;
    const MAX_LENGTH_TIMEFORMAT_WITH_MERIDIEM = 15;
    const data = event.clipboardData.getData('text');
    if (data.length === MAX_LENGTH_TIMEFORMAT_HUNDREDTHS_SECOND || data.length === MAX_LENGTH_TIMEFORMAT_THOUSANDTHS_SECOND) {
      this.model.renderTime(data, true);
      this.validate();
    } else if (data.length === MAX_LENGTH_TIMEFORMAT_WITH_MERIDIEM) {
      this.model.renderTime(data, false);
      this.validate();
    } else {
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
    const MAX_LENGTH_HOUR = 12;
    const hour = parseInt(this.model.hour, 10);
    return this.isNumber(this.model.hour) && hour >= 1 && hour <= MAX_LENGTH_HOUR;
  }

  isValidMinAndSecond(value: string): boolean {
    const MAX_LENGTH_MINUTE_SECOND = 59;
    const valueNum = parseInt(value, 10);
    return this.isNumber(value) && valueNum >= 0 && valueNum <= MAX_LENGTH_MINUTE_SECOND;
  }

  isValidMillisecond(): boolean {
    const MAX_LENGTH_MILLISECOND = 999;
    const millisecond = parseInt(this.model.millisecond, 10);
    return this.isNumber(this.model.millisecond) && millisecond >= 0 && millisecond <= MAX_LENGTH_MILLISECOND;
  }

  isValidMeridiem(): boolean {
    return this.model.meridiem === 'AM' || this.model.meridiem === 'PM';
  }

  isNumber(value: string): boolean {
    return /^\+?([0-9]\d*)$/.test(value);
  }

  updateModel() {
    this.modelChange.emit(this.model);
  }
}
