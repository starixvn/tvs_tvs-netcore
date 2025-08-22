import { Component, ElementRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagingConstant } from '../../../../utility/components/paging/paging.model';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { TooltipComponent } from '../../../../utility/components/tooltip/tooltip.component';
import { TEXT} from '../../../../utility/constants/text';
import { GetLogsQuery } from '../../models/query.model';
import { CheckValidateService } from '../../services/check-validate.service';
import { FilterAction, FilterDate } from './filter-logs.model';
import { NumbersOnlyDirective } from '../../../../utility/directives/numbers-only.directive';
import { DateFullTimeNewComponent } from '../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { DatePickerComponent } from '../../../../utility/components/date-time/date-picker/date-picker.component';

@Component({
  standalone: true,
  selector: 'filter-logs',
  templateUrl: './filter-logs.component.html',
  styleUrls: ['./filter-logs.component.scss'],
  imports: [CommonModule, FormsModule, NgbModule, NgSelectModule, TooltipComponent, DatePickerComponent],
  providers: [CheckValidateService, NumbersOnlyDirective]
})
export class FilterLogsComponent implements OnInit {
  model = new GetLogsQuery();
  action = new FilterAction();
  date = new FilterDate();
  minDate: NgbDate;
  tooltip = new Tooltip();
  isSuccessMatch = true;
  selectedActions: string[];

  @Output() searchEvent = new EventEmitter<GetLogsQuery>();

  private readonly element = inject(ElementRef);
  private readonly checkValidateService = inject(CheckValidateService);

  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnInit() {
    this.initDate();
    this.selectedActions = this.action.items.map(x => x.value);
  }

  initDate() {
    const DAYS_IN_THE_PAST = 7;
    const date = new Date();
    this.date.ngbFromDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    this.minDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate() - DAYS_IN_THE_PAST);
    this.date.ngbToDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  async search() {
    this.isSuccessMatch = await this.checkValidateService.checkValidMatch(this.model.matchId, this.tooltip);
    if (this.isSuccessMatch) {
      const query = this.getParams();
      this.searchEvent.emit(query);
    } else {
      this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
    }
  }

  private getParams(): GetLogsQuery {
    this.model.logDateTo = this.date.toDate;
    this.model.logDateFrom = this.date.fromDate;
    this.model.logActionIds = this.selectedActions.join(',');
    this.model.pageIndex = PagingConstant.INDEX_ZERO;
    this.model.pageSize = PagingConstant.SIZE_DEFAULT;

    return this.model;
  }

  async checkValidMatch() {
    this.isSuccessMatch = await this.checkValidateService.checkValidMatch(this.model.matchId, this.tooltip);
  }
}
