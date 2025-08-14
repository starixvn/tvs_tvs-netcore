
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { FilterTimeWithAllowanceComponent } from '../filter-time-with-allowance/filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';

@Component({
  selector: 'filter-time-area',
  templateUrl: './filter-time-area.component.html',
  styleUrls: ['./filter-time-area.component.scss'],
  standalone: true,
  imports: [FilterTimeWithAllowanceComponent, FormsModule]
})
export class FilterTimeAreaComponent implements OnInit {
  @Input() filterTimeWithAllowanceModel = new FilterTimeWithAllowance();
  @Input() isDisabled: boolean;
  @Input() isEdit: boolean;
  @Input() isVoided: boolean;
  @Input() filterBy: number;
  @Input() tvDetectionValue: number;
  @Output() filterByChange = new EventEmitter<number>();
  @Output() changeFilterEvent = new EventEmitter();
  @ViewChild('filterTimeWithAllowance') filterTimeWithAllowanceComponent: FilterTimeWithAllowanceComponent;

  fromDate: NgbDate;
  fromTime: string;
  toDate: NgbDate;
  toTime: string;
  maxDate: NgbDate;
  tooltip = new Tooltip();
  isMainMatch = true;
  changeActionWaitingToManualSubscription: Subscription;
  private readonly element = inject(ElementRef);
  private readonly addRequestStore = inject(AddRequestStore);

  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnInit() {
    this.changeActionWaitingToManualSubscription = this.addRequestStore.getChangeActionWaitingToManualEditPageSubject.subscribe(status => {
      if (status) {
        this.filterTimeWithAllowanceComponent.clearTimeWhenChangeActionWaitingToManualVoid();
      }
    });
  }

  ngOnDestroy(): void {
    this.changeActionWaitingToManualSubscription?.unsubscribe();
  }

  isValid(): boolean {
    if (this.filterTimeWithAllowanceComponent.isValid()) {
      return true;
    }

    return false;
  }

  emitAfterChangeFilterEvent(): void {
    this.filterByChange.emit(this.filterBy);
    this.changeFilterEvent.emit();
  }
}
