import { Component, ElementRef, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import * as moment from 'moment';
import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { DateTimeFormat } from '../../../internal/const/date-time-format';
import { TEXT } from '../../../internal/shared/text';

@Component({
    selector: 'date-full-time',
    templateUrl: 'date-full-time.component.html',
    styleUrls: ['date-full-time.component.scss']
})

export class DateFullTimeComponent {
  @Input() index = '';
  @Input() timeZone: string;
  @Input() dateTime: string;
  @Input() isDisabled: boolean;
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() allowedHideDate: boolean;
  @Input() readonly: boolean;
  @Output() dateTimeChange = new EventEmitter<string>();
  @Output() changeEvent = new EventEmitter();

  tooltip = new Tooltip();
  date: Date;
  time: string;
  isShowInputDate = true;
  isPasteTimeEvent: boolean;

  private readonly ALLOWED_TIME_FORMATS = [
    'h:mm:ss.SSS A',
    'h:mm:ss A',
  ];

  constructor(private readonly element: ElementRef) {
    this.tooltip.element = this.element;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['dateTime']) {
      this.updateData();
    }
  }

  ngOnInit(): void {
    this.updateData();
  }

  public updateData(): void {
    this.timeZone = 'America/Caracas';
    const momentDateTime = moment(this.dateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    this.date = new Date(momentDateTime.year(), momentDateTime.month(), momentDateTime.date());
    this.time = momentDateTime.format(DateTimeFormat.TIME_FORMAT);
  }

  public validateWithTooltip(): boolean {
    if (!this.isDateValid()) {
      this.tooltip.display(`date-input${this.index}`, TEXT.INVALID_TRANSDATE);
      return false;
    }

    if (!this.isTimeValid()) {
      this.tooltip.display(`time-input${this.index}`, TEXT.INVALID_TIME_FORMAT);
      return false;
    }

    this.dateTimeChange.emit(`${moment(this.date, DateTimeFormat.DATE_FORMAT, true).format(DateTimeFormat.DATE_FORMAT)} ${this.time}`);

    return true;
  }

  public isTimeValid(): boolean {
    const timeMoment = moment(this.time.trim(), DateTimeFormat.TIME_FORMAT, true);
    if (!timeMoment.isValid()) {
      return false;
    }

    return true;
  }

  public isDateValid(): boolean {
    const dateMoment = moment(this.date, DateTimeFormat.DATE_FORMAT, true);
    if (!dateMoment.isValid()) {
      return false;
    }

    return true;
  }

  public changeModel(): void {
    this.changeEvent.emit();
  }

  public onChangeTime(newTime: string): void {
    if (this.isPasteTimeEvent && this.isPasteCorrectTime(newTime)) {
      this.time = moment(newTime.trim(), this.ALLOWED_TIME_FORMATS, true).format(DateTimeFormat.TIME_FORMAT);
    }

    this.isPasteTimeEvent = false;
  }

  public onPasteTime(): void {
    this.isPasteTimeEvent = true;
  }

  private isPasteCorrectTime(time: string): boolean {
    return moment(time.trim(), this.ALLOWED_TIME_FORMATS, true).isValid();
  }
}
