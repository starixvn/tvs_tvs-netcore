import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { FilterModel } from '../../filter/filter.model';
import { FilterOtherIssuesModel } from '../models/filter-other-isssues.model';
import { ValidationService } from '../services/validation.service';


@Component({
  selector: 'filter-other-issues',
  templateUrl: './filter-other-issues.component.html',
  styleUrls: ['./filter-other-issues.component.scss']
})

export class FilterOtherIssuesComponent {
  @Input() model: FilterOtherIssuesModel;
  @Input() filterModel = new FilterModel();
  @Input() isEdit: boolean;
  @Input() matchId: number;
  @Output() changeFilterEvent = new EventEmitter();
  @Output() refreshEvent = new EventEmitter();
  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;

  tooltip = new Tooltip();

  constructor(
    private readonly element: ElementRef,
    private readonly validationService: ValidationService) {
    this.tooltip.element = this.element;
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public isValidity(): boolean {
    return this.fromTimeComponent.validateWithTooltip()
      && this.toTimeComponent.validateWithTooltip()
      && this.validationService.isFromTimeSameOrBeforeToTime(this.model, this.tooltip);
  }

  public emitRefreshEvent() {
    this.refreshEvent.emit();
  }
}
