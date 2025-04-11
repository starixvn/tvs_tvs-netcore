import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../utility/constants/config';
import { CommonStaticService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { Tooltip } from '../../tooltip/tooltip.model';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipComponent } from '../../tooltip/tooltip.component';

@Component({
  standalone: true,
  selector: 'date-full-time-new',
  templateUrl: './date-full-time-new.component.html',
  styleUrls: ['./date-full-time-new.component.scss'],
  imports: [FormsModule, NgbModule, TooltipComponent]
})
export class DateFullTimeNewComponent implements OnInit, OnChanges {
  @Input() index: number = null;
  @Input() timeZone: string;
  @Input() dateTime: string;
  @Input() isDisabled: boolean;
  @Input() maxDate: NgbDate;
  @Input() minDate: NgbDate;
  @Input() allowedHideDate = false;
  @Input() withOfTime = 130;
  @Input() readonly = true;
  @Input() timeClass = '';
  @Input() timeFormat = DateTimeFormat.TIME_FORMAT;
  @Output() dateTimeChange = new EventEmitter<string>();
  @Output() changeEvent = new EventEmitter();
  @ViewChild('datePicker') datePicker: NgbInputDatepicker;

  tooltip = new Tooltip();
  date: NgbDate;
  time: string;
  isShowInputDate = true;
  isPasteTimeEvent: boolean;
  dateTimeFormat: string;

  private readonly ALLOWED_TIME_FORMATS = [
    'h:mm:ss.SSS A',
    'h:mm:ss A',
    'HH:mm:ss'
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

  public onClickIconCalendar(): void {
    if (this.allowedHideDate) {
      this.isShowInputDate = !this.isShowInputDate;
    } else {
      this.datePicker.toggle();
    }
  }

  public updateData(): void {
    this.timeZone = 'America/Caracas';
    this.dateTimeFormat = `YYYY/MM/DD ${this.timeFormat}`;
    const momentDateTime = moment(this.dateTime, this.dateTimeFormat);
    this.date = new NgbDate(momentDateTime.year(), momentDateTime.month() + 1, momentDateTime.date());
    this.time = momentDateTime.format(this.timeFormat);
  }

  public validateWithTooltip(): boolean {
    if (!this.isTimeValid()) {
      this.tooltip.display(`time-input${this.index}`, `Invalid Date Time format. The correct format is "${this.dateTimeFormat}"`);
      return false;
    }
    this.getDateTime();

    return true;
  }

  public getDateTime(): string {
    this.time = CommonStaticService.convertToStrictTimeFormat(this.time, this.timeFormat);
    this.dateTime = moment(`${StaticService.convertToFullDate(this.date)} ${this.time}`,this.dateTimeFormat, true).format(this.dateTimeFormat);
    this.dateTimeChange.emit(this.dateTime);

    return this.dateTime;
  }

  public isTimeValid(): boolean {
    const timeMoment = moment(this.time.trim(), this.timeFormat, true);
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
      this.time = moment(newTime.trim(), this.ALLOWED_TIME_FORMATS, true).format(this.timeFormat);
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