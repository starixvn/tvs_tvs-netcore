import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../utility/constants/config';
import { CommonStaticService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { Tooltip } from '../../tooltip/tooltip.model';
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  standalone: true,
  selector: 'date-full-time-new',
  templateUrl: './date-full-time-new.component.html',
  styleUrls: ['./date-full-time-new.component.scss'],
  imports: [DatePickerComponent, FormsModule, CommonModule, TooltipComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateFullTimeNewComponent,
      multi: true
    }
  ]
})
export class DateFullTimeNewComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() index = 0;
  @Input() timeZone: string;
  @Input() isDisabled = false;
  @Input() maxDate: NgbDate;
  @Input() minDate: NgbDate;
  @Input() allowedHideDate = false;
  @Input() withOfTime = 130;
  @Input() readonly = true;
  @Input() timeClass = '';
  @Input() timeFormat = DateTimeFormat.TIME_FORMAT;

  tooltip = new Tooltip();
  date: NgbDate;
  time: string;
  isShowInputDate = true;
  isPasteTimeEvent: boolean;
  dateTimeFormat: string;

  private _inputDisabled = false;
  private _dateTime: string;
  private _onChange: (value: string) => void = () => { };
  private _onTouched: () => void = () => { };
  private readonly ALLOWED_TIME_FORMATS = [
    'h:mm:ss.SSS A',
    'h:mm:ss A',
    'hh:mm:ss A',
    'HH:mm:ss'
  ];
  private readonly element = inject(ElementRef);

  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['dateTime']) {
      this.updateData();
    }
    if (changes['isDisabled']) {
      this._inputDisabled = this.isDisabled;
    }
  }

  ngOnInit() {
    this.updateData();
    this._inputDisabled = this.isDisabled;
  }

  updateData() {
    this.timeZone = 'America/Caracas';
    this.dateTimeFormat = `YYYY/MM/DD ${this.timeFormat}`;
    const momentDateTime = moment(this._dateTime, this.dateTimeFormat);
    this.date = new NgbDate(momentDateTime.year(), momentDateTime.month() + 1, momentDateTime.date());
    this.time = momentDateTime.format(this.timeFormat);
  }

  onChangeModel() {
    this.time = CommonStaticService.convertToStrictTimeFormat(this.time, this.timeFormat);
    this._dateTime = moment(`${StaticService.convertToFullDate(this.date)} ${this.time}`, this.dateTimeFormat, true).format(this.dateTimeFormat);
    this._onChange(this._dateTime);
  }

  validateWithTooltip(): boolean {
    if (!this.isTimeValid()) {
      this.tooltip.display(`time-input${this.index}`, `Invalid Date Time format. The correct format is "${this.dateTimeFormat}"`);
      return false;
    }
    return true;
  }

  getDateTime() {
    return this._dateTime;
  }

  isTimeValid() {
    const timeMoment = moment(this.time.trim(), this.timeFormat, true);

    return timeMoment.isValid()
  }

  updateTime(newTime: string) {
    if (this.isPasteCorrectTime(newTime)) {
      this.time = moment(newTime.trim(), this.ALLOWED_TIME_FORMATS, true).format(this.timeFormat);
      this.onChangeModel();
    }
  }

  onChangeTime(newTime: string) {
    if (this.isPasteTimeEvent) {
      this.updateTime(newTime);
    }
    this.isPasteTimeEvent = false;
  }

  onPasteTime() {
    this.isPasteTimeEvent = true;
  }

  isPasteCorrectTime(time: string) {
    return moment(time.trim(), this.ALLOWED_TIME_FORMATS, true).isValid();
  }

  onBlur() {
    const isTimeValid = this.validateWithTooltip();
    if (isTimeValid) {
      this.onChangeModel();
    }
    this._onTouched();
  }

  writeValue(value: string): void {
    this._dateTime = value;
    this.updateData();
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(state: boolean): void {
    if (!this._inputDisabled) {
      this.isDisabled = state;
    }
  }
}