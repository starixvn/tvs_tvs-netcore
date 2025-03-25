
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TooltipComponent } from 'src/utility/components/tooltip/tooltip.component';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterOddsType, FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { ValidationService } from '../services/validation.service';

@Component({
    selector: 'filter-wrong-odds-sports-book',
    templateUrl: './filter-wrong-odds-sports-book.component.html',
    styleUrls: ['./filter-wrong-odds-sports-book.component.scss'],
    standalone: true,
    imports: [DateFullTimeNewComponent, FormsModule, NgSelectComponent, TooltipComponent]
})
export class FilterWrongOddsSportsBookComponent {
  @Input() filterWrongOddsSportsBookModel: FilterWrongOddsSportsBookModel;
  @Input() isEdit: boolean;
  @Input() matchId: number;
  @Input() subIssueTypeId: string;
  @Input() isVoided: boolean;
  @Output() changeFilterEvent = new EventEmitter();
  @Output() refreshEvent = new EventEmitter();
  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;

  tooltip = new Tooltip();
  filterOddsType = new FilterOddsType();

  constructor(
    private readonly element: ElementRef,
    private readonly validationService: ValidationService) {
    this.tooltip.element = this.element;
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public isValidOddsFilterByValue(value: string): boolean {
    return this.validationService.isValidFilterOddsValue(value, this.tooltip);
  }

  public isValidOddsFilterByRange(value: string, elementClass: string): boolean {
    if (value) {
      if (!StaticService.isCorrectFormatSingleDecimal(value, elementClass, this.tooltip, TEXT.INVALID_ODDS)) {
        return false;
      }

      return this.validationService.isOddsValueHaveNotZeroNumber(value, this.tooltip, elementClass);
    }

    return true;
  }

  public isCorrectFormatMultipleDecimal(value: string, elementClass: string): boolean {
    return value ? StaticService.isCorrectFormatMultipleDecimal(value, elementClass, this.tooltip, TEXT.INVALID_ODDS) : true;
  }

  public setFilterOddsType(type: string): void {
    this.filterWrongOddsSportsBookModel.filterOddsType = type;
  }

  public isValidity(): boolean {
    return this.isValidDateTime() && this.isValidFilter();
  }

  private isValidDateTime(): boolean {
    return this.fromTimeComponent.validateWithTooltip()
      && this.toTimeComponent.validateWithTooltip()
      && this.validationService.isFromTimeSameOrBeforeToTime(this.filterWrongOddsSportsBookModel, this.tooltip);
  }

  private isValidFilter(): boolean {
    return this.validationService.isValidFilterWrongOddsSportsBook(this.filterWrongOddsSportsBookModel, this.tooltip);
  }

  public emitRefreshEvent() {
    this.refreshEvent.emit();
  }
}
