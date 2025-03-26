import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { TooltipComponent } from '../../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { FilterModel } from '../../filter/filter.model';
import { FilterOtherIssuesModel } from '../models/filter-other-isssues.model';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'filter-other-issues',
  templateUrl: './filter-other-issues.component.html',
  styleUrls: ['./filter-other-issues.component.scss'],
  standalone: true,
  imports: [FormsModule, DateFullTimeNewComponent, TooltipComponent]
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
  private readonly element = inject(ElementRef);
  private readonly validationService = inject(ValidationService);

  constructor() {
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
