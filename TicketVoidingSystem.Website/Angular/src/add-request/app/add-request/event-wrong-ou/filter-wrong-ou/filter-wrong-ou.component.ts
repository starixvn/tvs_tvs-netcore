import { FilterModel } from './../../filter/filter.model';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'filter-wrong-ou',
  templateUrl: './filter-wrong-ou.component.html',
  styleUrls: ['./filter-wrong-ou.component.scss']
})
export class FilterWrongOuComponent {
  @Input() filterWrongOuModel: FilterWrongOuModel;
  @Input() isEdit: boolean;
  @Input() matchId: number;
  @Input() isMainMatch: boolean;
  @Input() isDisabled: boolean;
  @Input() filter: FilterModel;
  @Input() sportTypeId: number;
  @Output() searchTicketEvent = new EventEmitter();
  @Output() refreshEvent = new EventEmitter();
  @Output() changeFilterEvent = new EventEmitter();

  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;

  tooltip = new Tooltip();

  constructor(
    private readonly element: ElementRef,
    private readonly validationService: ValidationService
  ) {
      this.tooltip.element = this.element;
  }

  public changeFilterBy(): void {
    if (!this.filterWrongOuModel.filterFromTransTime || !this.filterWrongOuModel.filterToTransTime) {
        const currentMoment = moment.utc().tz('America/Caracas');
        this.filterWrongOuModel.filterFromTransTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
        this.filterWrongOuModel.filterToTransTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
      }
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public getDurationTime(): string {
    if (!this.fromTimeComponent?.isTimeValid() || !this.toTimeComponent?.isTimeValid()) {
      return '-';
    }

    const fromTime = moment(this.filterWrongOuModel.filterFromTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const toTime = moment(this.filterWrongOuModel.filterToTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);

    return StaticService.getDurations(fromTime, toTime);
  }

  public isValid(): boolean {
    return this.isValidDateTime() && this.isValidHdp() && this.isValidLiveIndicator();
  }

  private isValidLiveIndicator(): boolean {
    if (_.isNull(this.filterWrongOuModel.liveIndicator) || _.isUndefined(this.filterWrongOuModel.liveIndicator)) {
      this.tooltip.display('radio-liveindicator', TEXT.REQUIRED_FIELD);
      return false;
    }

    return true;
  }

  private isValidDateTime(): boolean {
    return this.fromTimeComponent.validateWithTooltip()
      && this.toTimeComponent.validateWithTooltip()
      && this.validationService.isFromTimeSameOrBeforeToTime(this.filterWrongOuModel.filterFromTransTime, this.filterWrongOuModel.filterToTransTime, this.tooltip);
  }

  private isValidHdp(): boolean {
    return this.validationService.isValidHdp(this.filterWrongOuModel, this.tooltip);
  }

  public isCorrectFormatHdp(value: string, elementClass: string): boolean {
    return StaticService.isCorrectFormatMultipleDecimal(value, elementClass, this.tooltip, TEXT.INVALID_OU);
  }

  public emitSearchEvent(): void {
    this.searchTicketEvent.emit();
  }

  public emitRefreshEvent(): void {
    this.refreshEvent.emit();
  }
}
