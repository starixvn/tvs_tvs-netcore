import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../utility/constants/config';
import { LABELS } from '../../../../utility/constants/labels';
import { CommonStaticService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { Tooltip } from '../../tooltip/tooltip.model';

@Component({
  selector: 'date-full-time-new',
  templateUrl: './date-full-time-new.component.html',
  styleUrls: ['./date-full-time-new.component.scss']
})
export class DateFullTimeNewComponent implements OnInit, OnChanges {
  @Input() index: number = null;
  @Input() timeZone: string;
  @Input() dateTime: string;
  @Input() isDisabled: boolean;
  @Input() maxDate: NgbDate;
  @Input() minDate: NgbDate;
  @Input() allowedHideDate = false;
  @Input() readonly = true;
  @Output() dateTimeChange = new EventEmitter<string>();
  @Output() changeEvent = new EventEmitter();

  tooltip = new Tooltip();
  date: NgbDate;
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
    this.date = new NgbDate(momentDateTime.year(), momentDateTime.month() + 1, momentDateTime.date());
    this.time = momentDateTime.format(DateTimeFormat.TIME_FORMAT);
  }

  public validateWithTooltip(): boolean {
    if (!this.isTimeValid()) {
      this.tooltip.display(`time-input${this.index}`, LABELS.INVALID_TIME_FORMAT);
      return false;
    }

    this.time = CommonStaticService.convertToStrictTimeFormat(this.time);
    this.dateTime = moment(`${StaticService.convertToFullDate(this.date)} ${this.time}`,DateTimeFormat.FULL_DATE_TIME_FORMAT, true)
      .format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    this.dateTimeChange.emit(this.dateTime);

    return true;
  }

  public isTimeValid(): boolean {
    const timeMoment = moment(this.time.trim(), DateTimeFormat.TIME_FORMAT, true);
    if (!timeMoment.isValid()) {
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