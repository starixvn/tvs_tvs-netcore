import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from 'src/utility/components/tooltip/tooltip.component';
import { TvDetectionService } from '../../../../../manage-request/app/request-list/services/tv-detection.service';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { AddRequestStore } from '../../add-request.store';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { AllowanceTimeComponent } from '../allowance-time/allowance-time.component';
import { ValidationService } from '../services/validation.service';
import { WrongScoreService } from '../services/wrong-score.service';

@Component({
  standalone: true,
  selector: 'filter-wrong-score',
  templateUrl: './filter-wrong-score.component.html',
  styleUrls: ['./filter-wrong-score.component.scss'],
  imports: [DateFullTimeNewComponent, AllowanceTimeComponent, FormsModule, CommonModule, TooltipComponent]
})
export class FilterWrongScoreComponent {
  @Input() filterWrongScoreModel: FilterTimeWithAllowance;
  @Input() isVoided: boolean;
  @Input() tvDetectionValue: number;
  @Output() changeFilterEvent = new EventEmitter();
  @ViewChild('allowanceTimeComponent') allowanceTimeComponent: AllowanceTimeComponent;
  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;
  tooltip = new Tooltip();
  private readonly element = inject(ElementRef);
  private readonly validationService = inject(ValidationService);
  private readonly wrongScoreService = inject(WrongScoreService);
  private readonly addRequestStore = inject(AddRequestStore);

  constructor() {
    this.tooltip.element = this.element;
  }

  getTvDetectionClass() {
    return TvDetectionService.getTvDetectionClass(this.tvDetectionValue);
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
    this.filterWrongScoreModel.aaTime = Number(this.allowanceTimeComponent.aaTime);
    this.filterWrongScoreModel.paTime = Number(this.allowanceTimeComponent.paTime);
    this.filterWrongScoreModel.saTime = Number(this.allowanceTimeComponent.saTime);
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
