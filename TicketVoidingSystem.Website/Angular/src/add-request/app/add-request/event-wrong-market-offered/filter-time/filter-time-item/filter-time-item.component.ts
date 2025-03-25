import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from 'src/utility/components/tooltip/tooltip.component';
import { DateFullTimeNewComponent } from '../../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterWrongMarketOfferedModel } from '../../models/filter-wrong-market-offered.model';

@Component({
    selector: 'filter-time-item',
    templateUrl: './filter-time-item.component.html',
    styleUrls: ['./filter-time-item.component.scss'],
    standalone: true,
    imports: [DateFullTimeNewComponent, FormsModule, CommonModule, TooltipComponent]
})
export class FilterTimeItemComponent {
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

  constructor(private readonly element: ElementRef) {
    this.tooltip.element = this.element;
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
      this.addItemEvent.emit(this.model);
    }
  }

  removeBetTypeItem(index: number): void {
    if (!this.isVoided) {
      this.removeItemEvent.emit(index);
    }
  }

  showTooltip(className: string, text: string): void {
   this.tooltip.display(className, text);
  }
}
