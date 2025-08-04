import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DateTimeFormat } from '../../../../utility/constants/config';
import { CommonStaticService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { Tooltip } from '../../tooltip/tooltip.model';
import { DatePickerComponent } from '../date-picker/date-picker.component';
dayjs.extend(customParseFormat);

@Component({
  standalone: true,
  selector: 'date-full-time-new',
  templateUrl: './date-full-time-new.component.html',
  styleUrls: ['./date-full-time-new.component.scss'],
  imports: [DatePickerComponent, FormsModule, CommonModule, TooltipComponent, NgbModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateFullTimeNewComponent,
      multi: true
    }
  ]
})
export class DateFullTimeNewComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() index: number = null;
  @Input() timeZone: string;
  @Input() isDisabled = false;
  @Input() maxDate: NgbDate;
  @Input() minDate: NgbDate;
  @Input() allowedHideDate = false;
  @Input() withOfTime = 130;
  @Input() readonly = true;
  @Input() timeClass = '';
  @Input() timeFormat = DateTimeFormat.TIME_FORMAT;
  @Input() dateTimeFormatInput = DateTimeFormat.DATE_TIME_FORMAT_24H;

  tooltip = new Tooltip();
  date: NgbDate;
  time: string;
  isShowInputDate = true;
  isPasteTimeEvent: boolean;
  dateTimeFormat: string;

  private _inputDisabled: boolean = false;
  private _dateTime: string;
  private _onChange: (value: string) => void = () => { };
  private _onTouched: () => void = () => { };
  private readonly ALLOWED_TIME_FORMATS = [
    'h:mm:ss.SSS A',
    'h:mm:ss A',
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
    const dayjsDateTime = dayjs(this._dateTime, this.dateTimeFormatInput);
    this.date = new NgbDate(dayjsDateTime.year(), dayjsDateTime.month() + 1, dayjsDateTime.date());
    this.time = dayjsDateTime.format(this.timeFormat);
  }

  onChangeModel() {
    this.time = CommonStaticService.convertToStrictTimeFormat(this.time, this.timeFormat);
    this._dateTime = dayjs(`${StaticService.convertToFullDate(this.date)} ${this.time}`, this.dateTimeFormat).format(this.dateTimeFormat);
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
    const timeDayjs = dayjs(this.time.trim(), this.timeFormat);
    if (!timeDayjs.isValid()) {
      return false;
    }
    return true;
  }

  onChangeTime(newTime: string) {
    if (this.isPasteTimeEvent && this.isPasteCorrectTime(newTime)) {
      this.time = dayjs(newTime.trim(), this.ALLOWED_TIME_FORMATS).format(this.timeFormat);
    }
    this.isPasteTimeEvent = false;
  }

  onPasteTime() {
    this.isPasteTimeEvent = true;
  }

  isPasteCorrectTime(time: string) {
    return dayjs(time.trim(), this.ALLOWED_TIME_FORMATS).isValid();
  }

  onBlur() {
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