import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { GetBetTypesQuery } from '../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { PagingConstant } from '../../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { ModeType } from '../../../../utility/constants/config';
import { LABELS } from '../../../../utility/constants/labels';
import { CommonService } from '../../../../utility/services/common.service';
import { GetLogsQuery } from '../../models/query.model';
import { FilterAction, FilterDate } from './filter-logs.model';

@Component({
  selector: 'filter-logs',
  templateUrl: './filter-logs.component.html',
  styleUrls: ['./filter-logs.component.scss']
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

  constructor(
    private readonly commonService: CommonService, 
    private readonly element: ElementRef) {
    this.tooltip.element = element;
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
    await this.checkValidMatch();
    if (this.isSuccessMatch) {
      const query = this.getParams();
      this.searchEvent.emit(query);
    } else {
      this.tooltip.display('match-id', LABELS.INVALID_MATCH);
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
    if (this.model.matchId === '' || this.model.matchId === null || _.isUndefined(this.model.matchId)) {
      this.isSuccessMatch = true;
      return;
    }

    if (this.model.matchId === '29') {
      this.isSuccessMatch = true;
      return;
    }

    const query: GetBetTypesQuery = { mode: ModeType.SPORT_BOOK, matchId: parseInt(this.model.matchId, 10) };
    const data = await this.commonService.getGroupBetTypes(query);

    if (data.result.errorCode === 0) {
      if (data.groupBetTypes.length === 0) {
        this.tooltip.display('match-id', LABELS.INVALID_MATCH);
        this.isSuccessMatch = false;
      } else {
        this.isSuccessMatch = true;
      }
    } else {
      this.tooltip.display('match-id', data.result.errorMsg);
      this.isSuccessMatch = false;
    }
  }
}
