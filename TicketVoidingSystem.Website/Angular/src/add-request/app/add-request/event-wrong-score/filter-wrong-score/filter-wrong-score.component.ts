import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { AddRequestStore } from '../../add-request.store';
import { AllowanceTimeComponent } from '../allowance-time/allowance-time.component';
import { FilterWrongScoreModel } from '../models/filter-wrong-score.model';
import { ValidationService } from '../services/validation.service';
import { WrongScoreService } from '../services/wrong-score.service';
import { TvDetectionService } from '../../../../../manage-request/app/request-list/services/tv-detection.service';

@Component({
  selector: 'filter-wrong-score',
  templateUrl: './filter-wrong-score.component.html',
  styleUrls: ['./filter-wrong-score.component.scss']
})
export class FilterWrongScoreComponent {
  @Input() filterWrongScoreModel: FilterWrongScoreModel;
  @Input() isVoided: boolean;
  @Input() tvDetectionValue: number;
  @Output() changeFilterEvent = new EventEmitter();
  @ViewChild('allowanceTimeComponent') allowanceTimeComponent: AllowanceTimeComponent;
  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;
  tooltip = new Tooltip();

  constructor(
    private readonly element: ElementRef,
    private readonly validationService: ValidationService,
    private readonly wrongScoreService: WrongScoreService,
    private readonly addRequestStore: AddRequestStore
  ) {
    this.tooltip.element = this.element;
  }

  getTvDetectionClass() {
    return TvDetectionService.getTvDetectionClass(this.tvDetectionValue);
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
    this.addRequestStore.changeSavingRequestStatus(true);
  }

  public getDurationTime(): string {
    if (!this.fromTimeComponent?.isTimeValid() || !this.toTimeComponent?.isTimeValid()) {
      return '-';
    }

    return this.wrongScoreService.getDurationTime(this.filterWrongScoreModel.fromDateTime, this.filterWrongScoreModel.toDateTime);
  }

  public isValid(): boolean {
    if (!this.fromTimeComponent.validateWithTooltip() || !this.toTimeComponent.validateWithTooltip()) {
      return false;
    }

    if (!this.validationService.isFromTimeSameOrBeforeToTime(this.filterWrongScoreModel.fromDateTime, this.filterWrongScoreModel.toDateTime, this.tooltip)) {
      return false;
    }

    if (!this.allowanceTimeComponent.isValidAllowanceTime()) {
      return false;
    }

    return true;
  }
}
