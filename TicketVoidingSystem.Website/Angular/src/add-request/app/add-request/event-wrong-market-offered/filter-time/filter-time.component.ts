import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';
import { EventWrongMarketOfferedService } from '../services/event-wrong-market-offfered.service';
import { FilterTimeItemComponent } from './filter-time-item/filter-time-item.component';

@Component({
  selector: 'filter-time',
  templateUrl: './filter-time.component.html',
  styleUrls: ['./filter-time.component.scss']
})

export class FilterTimeComponent {
  @Input() isVoided: boolean;
  @Input() models: FilterWrongMarketOfferedModel[];
  @Output() changeFilterEvent = new EventEmitter();
  @Output() refreshEvent = new EventEmitter();
  @ViewChildren('filterItem') filterItemComponents: QueryList<FilterTimeItemComponent>;

  tooltip = new Tooltip();
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';

  constructor(
    private readonly element: ElementRef,
    private readonly eventWrongMarketOfferedService: EventWrongMarketOfferedService
  ) {
    this.tooltip.element = this.element;
  }

  changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  isValidity(): boolean {
    return this.filterItemComponents.toArray().every(x => x.isValidity());
  }

  emitRefreshEvent() {
    this.refreshEvent.emit();
  }

  addItem(): void {
    this.models.push(this.eventWrongMarketOfferedService.initDefaultTime());
  }

  removeItem(index: number): void {
    this.models.splice(index, 1);
  }
}
