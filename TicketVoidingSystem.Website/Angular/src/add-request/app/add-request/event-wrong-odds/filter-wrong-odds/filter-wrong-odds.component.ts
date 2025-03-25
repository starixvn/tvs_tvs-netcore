import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import moment from 'moment-timezone';
import { TooltipComponent } from 'src/utility/components/tooltip/tooltip.component';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { AllowanceRate, DateTimeFormat } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterFavoriteType, FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { CalculateOddsService } from '../services/calculate-odds.service';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'filter-wrong-odds',
  templateUrl: './filter-wrong-odds.component.html',
  styleUrls: ['./filter-wrong-odds.component.scss'],
  standalone: true,
  imports: [DateFullTimeNewComponent, NgSelectModule, TooltipComponent, FormsModule]
})
export class FilterWrongOddsComponent {
  @Input() filterWrongOddsModel: FilterWrongOddsModel;
  @Input() isEdit: boolean;
  @Input() subIssueTypeId: string;
  @Input() isDisabled: boolean;
  @Output() changeFilterEvent = new EventEmitter();
  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;

  tooltip = new Tooltip();
  filterFavoriteType = new FilterFavoriteType();
  allowanceRates = AllowanceRate.ALLOWANCE_RATE;

  private readonly element = inject(ElementRef);
  private readonly validationService = inject(ValidationService);
  private readonly calculateOddsService = inject(CalculateOddsService);

  constructor() {
    this.tooltip.element = this.element;
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public getDurationTime(): string {
    if (!this.fromTimeComponent?.isTimeValid() || !this.toTimeComponent?.isTimeValid()) {
      return '-';
    }

    const fromTime = moment(this.filterWrongOddsModel.filterFromTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const toTime = moment(this.filterWrongOddsModel.filterToTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);

    return StaticService.getDurations(fromTime, toTime);
  }

  public isCorrectFormatSingleDecimal(value: string, elementClass: string): boolean {
    return value ? StaticService.isCorrectFormatSingleDecimal(value, elementClass, this.tooltip, TEXT.INVALID_INPUT) : true;
  }

  public isSubTypeOuOr1stOu(): boolean {
    return this.validationService.isSubTypeOuOr1stOu(this.subIssueTypeId);
  }

  public isValid(): boolean {
    return this.isValidDateTime() && this.isValidFilter();
  }

  private isValidDateTime(): boolean {
    return this.fromTimeComponent.validateWithTooltip()
      && this.toTimeComponent.validateWithTooltip()
      && this.validationService.isFromTimeSameOrBeforeToTime(this.filterWrongOddsModel, this.tooltip);
  }

  private isValidFilter(): boolean {
    return this.validationService.isValidFilterWrongOdds(this.filterWrongOddsModel, this.tooltip, this.subIssueTypeId);
  }

  public isValidFilterCorrectOdds(): boolean {
    return this.validationService.isValidFilterCorrectOdds(this.filterWrongOddsModel.correctOddsHomeOver,
      this.filterWrongOddsModel.spread, this.tooltip);
  }

  public changeCorrectOdds(): void {
    if (this.isValidFilterCorrectOdds()) {
      this.calculateOddsService.updateCorrectOddsAwayUnder(this.filterWrongOddsModel);
    }
    else {
      this.filterWrongOddsModel.correctOddsAwayUnder = '';
    }
  }

  public isValidSpread(): boolean {
    return this.validationService.isValidSpread(this.filterWrongOddsModel.spread, this.tooltip);
  }

  public changeSpread(): void {
    if (this.isValidSpread()) {
      this.calculateOddsService.updateAllowanceRate(this.filterWrongOddsModel);
      this.calculateOddsService.updateCorrectOddsAwayUnder(this.filterWrongOddsModel);
    }
  }
}
