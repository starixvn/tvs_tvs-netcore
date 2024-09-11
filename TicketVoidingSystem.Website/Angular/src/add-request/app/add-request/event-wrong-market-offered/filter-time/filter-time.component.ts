import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';

@Component({
  selector: 'filter-time',
  templateUrl: './filter-time.component.html',
  styleUrls: ['./filter-time.component.scss']
})

export class FilterTimeComponent {
  @Input() isVoided: boolean;
  @Input() filterWrongMarketOfferedModel = new FilterWrongMarketOfferedModel();
  @Output() changeFilterEvent = new EventEmitter();
  @Output() refreshEvent = new EventEmitter();
  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;

  tooltip = new Tooltip();
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';

  constructor(
    private readonly element: ElementRef
  ) {
    this.tooltip.element = this.element;
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public isValidity(): boolean {
    return this.fromTimeComponent.validateWithTooltip() && this.toTimeComponent.validateWithTooltip()
      && StaticService.isFromTimeSameOrBeforeToTime(this.filterWrongMarketOfferedModel.fromDateTime,
        this.filterWrongMarketOfferedModel.toDateTime, this.tooltip, this.FROM_DATE_TIME_CLASS);
  }

  public emitRefreshEvent() {
    this.refreshEvent.emit();
  }
}
