import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDate, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'date-picker',
  standalone: true,
  imports: [FormsModule, CommonModule, NgbInputDatepicker],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() index: number = null;
  @Input() disabled: boolean;
  @Input() maxDate: NgbDate;
  @Input() minDate: NgbDate;
  @Input() readonly = true;
  @Input() showInput = true;
  @Input() allowedHideDate = false;
  @ViewChild('datePicker') datePicker: NgbInputDatepicker;

  private _date: NgbDate;
  private _onChange: (value: NgbDate) => void = () => {};
  private _onTouched: () => void = () => {};

  get date(): NgbDate {
    return this._date;
  }

  set date(value: NgbDate) {
    if (this._date !== value) {
      this._date = value;
      this._onChange(value);
    }
  }

  onClickIconCalendar() {
    if (this.allowedHideDate) {
      this.showInput = !this.showInput;
    } else {
      this.datePicker.toggle();
    }
  }

  onBlur() {
    this._onTouched();
  }

  writeValue(value: NgbDate): void {
    this._date = value;
  }

  registerOnChange(fn: (value: NgbDate) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(state: boolean): void {
    this.disabled = state;
  }
}
