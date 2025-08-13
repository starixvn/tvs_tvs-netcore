import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { TvDetectionService } from '../../../../../../manage-request/app/request-list/services/tv-detection.service';
import { TooltipComponent } from '../../../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TimeZone } from '../../../../../../utility/constants/config';
import { LABELS } from '../../../../../../utility/constants/labels';
import { OnlyNumberDirective } from '../../../../../../utility/directives/number.directive';
import { CommonStaticService } from '../../../../../../utility/services/common.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterTimeWithAllowance } from './filter-time-with-allowance.model';

@Component({
  standalone: true,
  selector: 'filter-time-with-allowance',
  templateUrl: './filter-time-with-allowance.component.html',
  styleUrls: ['./filter-time-with-allowance.component.scss'],
  imports: [FormsModule, CommonModule, TooltipComponent, NgbModule, OnlyNumberDirective]
})
export class FilterTimeWithAllowanceComponent implements OnInit {
  @Input() isDisabled: boolean;
  @Input() isEdit: boolean;
  @Input() isUseInLogInfo: boolean;
  @Input() tvDetectionValue: number;
  @Input() filterTimeWithAllowanceModel: FilterTimeWithAllowance;
  @Output() refreshLogInfoEvent = new EventEmitter();
  @Output() changeFilterTimeEvent = new EventEmitter();
  @Output() changeAllowanceSettingTimeEvent = new EventEmitter();

  private readonly FROM_TIME_CLASS = 'from-time';
  private readonly TO_TIME_CLASS = 'to-time';

  fromDate: NgbDate;
  fromTime: string;
  toDate: NgbDate;
  toTime: string;
  maxDate: NgbDate;
  tooltip = new Tooltip();
  isShowInputFromDate: boolean;
  isShowInputToDate: boolean;
  private readonly element = inject(ElementRef);

  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
    this.setDefaultValue();
    this.isEdit || this.isHasTime() ? this.updateData() : this.initData();
  }

  clearTimeWhenChangeActionWaitingToManualVoid(): void {
    this.fromTime = this.toTime = '';
  }

  setDefaultValue(): void {
    if (this.isUseInLogInfo) {
      this.isShowInputFromDate = false;
      this.isShowInputToDate = false;
    } else {
      this.isShowInputFromDate = true;
      this.isShowInputToDate = true;
    }
  }

  initData(): void {
    const currentMoment = moment.utc().tz(TimeZone.AMERICA_CARACAS);
    this.fromDate = new NgbDate(currentMoment.year(), currentMoment.month() + 1, currentMoment.date());
    this.toDate = this.fromDate;
    this.fromTime = moment.utc().tz(TimeZone.AMERICA_CARACAS).millisecond(0).format(DateTimeFormat.TIME_FORMAT);
    this.toTime = currentMoment.format(DateTimeFormat.TIME_FORMAT);
    const maxDateMoment = currentMoment.add(1, 'day');
    this.maxDate = new NgbDate(maxDateMoment.year(), maxDateMoment.month() + 1, maxDateMoment.date());
  }

  updateData(): void {
    const currentMoment = moment.utc().tz(TimeZone.AMERICA_CARACAS);
    const maxDateMoment = currentMoment.add(1, 'day');
    const momentFromDate = moment(this.filterTimeWithAllowanceModel.fromDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const momentToDate = moment(this.filterTimeWithAllowanceModel.toDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    /// need recheck
    this.fromDate = new NgbDate(momentFromDate.year(), momentFromDate.month() + 1, momentFromDate.date());
    this.fromTime = momentFromDate.format(DateTimeFormat.TIME_FORMAT);
    this.toDate = new NgbDate(momentToDate.year(), momentToDate.month() + 1, momentToDate.date());
    this.toTime = momentToDate.format(DateTimeFormat.TIME_FORMAT);
    this.maxDate = new NgbDate(maxDateMoment.year(), maxDateMoment.month() + 1, maxDateMoment.date());
  }

  isValid(): boolean {
    if (!this.isFromTimeValid()) {
      return false;
    }

    if (!this.isToTimeValid()) {
      return false;
    }

    const fromDateTime = moment(`${StaticService.convertToFullDate(this.fromDate)} ${this.fromTime}`,
      DateTimeFormat.FULL_DATE_TIME_FORMAT, true);
    const toDateTime = moment(`${StaticService.convertToFullDate(this.toDate)} ${this.toTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT, true);
    if (!fromDateTime.isSameOrBefore(toDateTime)) {
      this.tooltip.display('from-date-time', LABELS.FROM_TIME_MUST_SMALLER_THAN_TO_TIME);

      return false;
    }

    if (!this.isSettingTimeValid()) {
      return false;
    }

    this.filterTimeWithAllowanceModel.fromDateTime = fromDateTime.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    this.filterTimeWithAllowanceModel.toDateTime = toDateTime.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);


    return true;
  }

  getDurationTime(): string {
    if (!this.isInputTimeValid(this.fromTime) || !this.isInputTimeValid(this.toTime)) {
      return '-';
    }

    const fromTime = moment(`${StaticService.convertToFullDate(this.fromDate)} ${this.fromTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const toTime = moment(`${StaticService.convertToFullDate(this.toDate)} ${this.toTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT);

    return StaticService.getDurations(fromTime, toTime);
  }

  emitChangeAllowanceSettingTimeEvent() {
    this.changeAllowanceSettingTimeEvent.emit();
  }

  changeFilterDateTime(): void {
    if (this.isUseInLogInfo) {
      this.clearSettingTime();
    }

    this.updateFilterTime();
    this.changeFilterTimeEvent.emit();
    this.emitChangeAllowanceSettingTimeEvent();
  }


  updateFilterTime(): void {
    const fromDateTime = moment(`${StaticService.convertToFullDate(this.fromDate)} ${this.fromTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT, true);
    const toDateTime = moment(`${StaticService.convertToFullDate(this.toDate)} ${this.toTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT, true);
    this.filterTimeWithAllowanceModel.fromDateTime = fromDateTime.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    this.filterTimeWithAllowanceModel.toDateTime = toDateTime.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  refreshLogInfo(): void {
    this.refreshLogInfoEvent.emit();
  }

  getTvDetectionClass() {
    return TvDetectionService.getTvDetectionClass(this.tvDetectionValue);
  }

  private clearSettingTime(): void {
    this.filterTimeWithAllowanceModel.aaTime = null;
    this.filterTimeWithAllowanceModel.paTime = null;
    this.filterTimeWithAllowanceModel.saTime = null;
  }

  private isSettingTimeValid(): boolean {
    if ((this.filterTimeWithAllowanceModel.aaTime?.toString() || this.filterTimeWithAllowanceModel.paTime?.toString() || this.filterTimeWithAllowanceModel.saTime?.toString()) &&
      (!this.filterTimeWithAllowanceModel.aaTime?.toString() || !this.filterTimeWithAllowanceModel.paTime?.toString() || !this.filterTimeWithAllowanceModel.saTime?.toString())) {
      this.tooltip.display('setting-void-time', LABELS.INVALID_SETTING_TIME);
      return false;
    }

    return true;
  }

  private isHasTime(): boolean {
    if (this.filterTimeWithAllowanceModel.fromDateTime && this.filterTimeWithAllowanceModel.toDateTime) {
      return true;
    }

    return false;
  }

  isFromTimeValid(): boolean {
    if (!this.isInputTimeValid(this.fromTime)) {
      this.tooltip.display(this.FROM_TIME_CLASS, LABELS.INVALID_TIME_FORMAT);
      return false;
    }

    this.fromTime = CommonStaticService.convertToStrictTimeFormat(this.fromTime, DateTimeFormat.TIME_FORMAT);
    return true;
  }

  isToTimeValid(): boolean {
    if (!this.isInputTimeValid(this.toTime)) {
      this.tooltip.display(this.TO_TIME_CLASS, LABELS.INVALID_TIME_FORMAT);
      return false;
    }

    this.toTime = CommonStaticService.convertToStrictTimeFormat(this.toTime, DateTimeFormat.TIME_FORMAT);
    return true;
  }

  private isInputTimeValid(time: string): boolean {
    const timeMoment = moment(time.trim(), DateTimeFormat.TIME_FORMAT, true);
    if (!timeMoment.isValid()) {
      return false;
    }

    return true;
  }

}
