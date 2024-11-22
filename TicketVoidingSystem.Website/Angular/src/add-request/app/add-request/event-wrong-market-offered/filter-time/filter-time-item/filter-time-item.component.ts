import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateFullTimeNewComponent } from 'src/utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { StaticService } from 'src/utility/services/static.service';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { FilterWrongMarketOfferedModel } from '../../models/filter-wrong-market-offered.model';

@Component({
  selector: 'filter-time-item',
  templateUrl: './filter-time-item.component.html',
  styleUrls: ['./filter-time-item.component.scss']
})
export class FilterTimeItemComponent implements OnInit {
  @Input() model: FilterWrongMarketOfferedModel;
  @Input() isVoided: boolean;
  @Input() index: number;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() changeFilterEvent = new EventEmitter();
  @Output() addItemEvent = new EventEmitter();
  @Output() removeItemEvent = new EventEmitter<number>();
  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;
  tooltip = new Tooltip();
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';

  constructor(
    private readonly element: ElementRef
  ) {
    this.tooltip.element = this.element;
  }


  ngOnInit(): void {
  }

  isValidity(): boolean {
    return this.fromTimeComponent.validateWithTooltip()
      && this.toTimeComponent.validateWithTooltip()
      && StaticService.isFromTimeSameOrBeforeToTime(this.model.fromDateTime, this.model.toDateTime, this.tooltip, this.FROM_DATE_TIME_CLASS);
  }

  changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  addBetTypeItem(): void {
    if (!this.isVoided) {
      this.addItemEvent.emit();
    }
  }

  removeBetTypeItem(index: number): void {
    if (!this.isVoided) {
      this.removeItemEvent.emit(index);
    }
  }
}
