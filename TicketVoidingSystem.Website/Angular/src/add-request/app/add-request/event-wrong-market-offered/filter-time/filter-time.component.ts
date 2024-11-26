import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
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

  constructor(
    private readonly eventWrongMarketOfferedService: EventWrongMarketOfferedService
  ) { }

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
    this.changeFilter();
    this.models.push(this.eventWrongMarketOfferedService.initDefaultTime());
    this.reRenderId();
  }

  removeItem(index: number): void {
    this.changeFilter();
    this.models.splice(index, 1);
    this.reRenderId();
  }

  private reRenderId() {
    this.models.forEach((model, index) => model.id = index + 1);
  }
}
