import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TEXT } from '../../../../../utility/constants/text';
import { DateFullTimeNewComponent } from '../../../../../utility/modules/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/modules/tooltip/tooltip.model';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterFavoriteType, FilterOddsType, FilterOuType, FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'filter-wrong-odds',
  templateUrl: './filter-wrong-odds.component.html',
  styleUrls: ['./filter-wrong-odds.component.scss']
})
export class FilterWrongOddsComponent {
  @Input() filterWrongOddsModel: FilterWrongOddsModel;
  @Input() isEdit: boolean;
  @Input() matchId: number;
  @Input() subIssueTypeId: string;
  @Input() isDisabled: boolean;
  @Output() changeFilterEvent = new EventEmitter();

  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;

  tooltip = new Tooltip();
  filterOddsType = new FilterOddsType();
  filterFavoriteType = new FilterFavoriteType();
  filterOuType = new FilterOuType();

  constructor(
    private readonly element: ElementRef,
    private readonly validationService: ValidationService) {
      this.tooltip.element = this.element;
    }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public getDurationTime(): string {
    return StaticService.getDurationTime(this.fromTimeComponent, this.toTimeComponent, this.filterWrongOddsModel.filterFromTransTime, this.filterWrongOddsModel.filterToTransTime);
  }

  public isValidMultipleOdds(value: string, elementClass: string): boolean {
    if(!StaticService.isCorrectFormatMultipleDecimal(value, elementClass, this.tooltip, TEXT.INVALID_ODDS)) {
      return false;
    }

    return this.validationService.isValidOddsValueHaveNotZero(value, this.tooltip, elementClass);
  }

  public isValidSingleOdds(value: string, elementClass: string): boolean {
    if(!StaticService.isCorrectFormatSingleDecimal(value, elementClass, this.tooltip, TEXT.INVALID_ODDS)) {
      return false;
    }

    return this.validationService.isValidOddsValueHaveNotZero(value, this.tooltip, elementClass);
  }

  public isCorrectFormatMultipleDecimal(value: string, elementClass: string): boolean {
    return StaticService.isCorrectFormatMultipleDecimal(value, elementClass, this.tooltip, TEXT.INVALID_ODDS);
  }

  public setFilterOddsType(type: string): void {
    this.filterWrongOddsModel.filterOddsType = type;
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
}
