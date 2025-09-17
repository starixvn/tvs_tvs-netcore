import { Component, EventEmitter, inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';
import { EventWrongMarketOfferedService } from '../services/event-wrong-market-offfered.service';
import { FilterTimeItemComponent } from './filter-time-item/filter-time-item.component';

@Component({
  selector: 'filter-time',
  templateUrl: './filter-time.component.html',
  styleUrls: ['./filter-time.component.scss'],
  standalone: true,
  imports: [FilterTimeItemComponent]
})

export class FilterTimeComponent {
  @Input() isVoided: boolean;
  @Input() models: FilterWrongMarketOfferedModel[];
  @Output() changeFilterEvent = new EventEmitter();
  @Output() refreshEvent = new EventEmitter();
  @ViewChildren('filterItem') filterItemComponents: QueryList<FilterTimeItemComponent>;

  private readonly eventWrongMarketOfferedService = inject(EventWrongMarketOfferedService);

  changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  isValidity(): boolean {
    return this.filterItemComponents.toArray().every(x => x.isValidity()) && this.isToTimeSmallerThanFromTimeNextScore();
  }

  emitRefreshEvent() {
    this.refreshEvent.emit();
  }

  addItem(previousTime: FilterWrongMarketOfferedModel): void {
    this.changeFilter();
    this.models.push(this.eventWrongMarketOfferedService.initRangeTimeByInputTime(previousTime.toDateTime));
    this.reRenderId();
  }

  removeItem(index: number): void {
    this.changeFilter();
    this.models.splice(index, 1);
    this.reRenderId();
  }

  isToTimeSmallerThanFromTimeNextScore(): boolean {
    return this.models.every((model, index) => {
      if (index === this.models.length - 1) {
        return true;
      }

      const momentToTime = moment(model.toDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
      const momentFromTimeNextScore = moment(this.models[index + 1].fromDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
      const comparingFromTimeNextScore = momentFromTimeNextScore.subtract(2, 'milliseconds').format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
      if (momentToTime.isSameOrAfter(moment(comparingFromTimeNextScore, DateTimeFormat.FULL_DATE_TIME_FORMAT))) {
        this.filterItemComponents.toArray()[index].tooltip.display(`to-date-time-${index + 1}`, TEXT.TO_TIME_MUST_SMALLER_THAN_NEXT_FROM_TIME);
        return false;
      }
      return true;
    });
  }

  private reRenderId() {
    this.models.forEach((model, index) => model.id = index + 1);
  }
}
