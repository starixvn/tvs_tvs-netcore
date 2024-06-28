import { Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterFavoriteType, FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { ValidationService } from '../services/validation.service';
import { AllowanceRate } from '../../../../../utility/constants/config';
import { CalculateOddsService } from '../services/calculate-odds.service';

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
  filterFavoriteType = new FilterFavoriteType();
  allowanceRates = AllowanceRate.ALLOWANCE_RATE;
  
  constructor(
    private readonly element: ElementRef,
    private readonly validationService: ValidationService,
    private readonly calculateOddsService: CalculateOddsService) {
      this.tooltip.element = this.element;
    }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public getDurationTime(): string {
    return StaticService.getDurationTime(this.fromTimeComponent, this.toTimeComponent, this.filterWrongOddsModel.filterFromTransTime, this.filterWrongOddsModel.filterToTransTime);
  }

  public isCorrectFormatMultipleDecimal(value: string, elementClass: string): boolean {
    return StaticService.isCorrectFormatMultipleDecimal(value, elementClass, this.tooltip, TEXT.INVALID_ODDS);
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
    if(this.isValidFilterCorrectOdds()){
      this.calculateOddsService.updateCorrectOddsAwayUnder(this.filterWrongOddsModel);
    }
    else{
      this.filterWrongOddsModel.correctOddsAwayUnder = '';
    }
  }

  public isValidSpread(): boolean{
    return this.validationService.isValidSpread(this.filterWrongOddsModel.spread, this.tooltip);
  }

  public changeSpread(): void {
    if(this.isValidSpread()){
      this.calculateOddsService.updateAllowanceRate(this.filterWrongOddsModel);
      this.calculateOddsService.updateCorrectOddsAwayUnder(this.filterWrongOddsModel);
    }
  }
}
