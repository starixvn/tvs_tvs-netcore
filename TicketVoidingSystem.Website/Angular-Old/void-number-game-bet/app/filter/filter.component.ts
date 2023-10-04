import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { BetTypesComponent } from '../../../internal/components/bettypes/bettypes.component';
import { BetTypesModel } from '../../../internal/components/bettypes/bettypes.model';
import { DateFullTimeComponent } from '../../../internal/components/date-full-time/date-full-time.component';
import { GetBetTypesQuery } from '../../../internal/components/group-bettypes/group-bettypes.model';
import { InputBetIdsComponent } from '../../../internal/components/input-betids/input-betids.component';
import { PagingText } from '../../../internal/components/paging/setting';
import { DateTimeFormat } from '../../../internal/const/date-time-format';
import { BallSequences } from '../../../internal/models/ball-sequences';
import { ModeType } from '../../../internal/shared/config';
import { TEXT } from '../../../internal/shared/text';
import { AppService } from '../app.service';
import { GetTicketsQuery } from '../models/query.model';

export class Option {
  static readonly MATCH_ID = 'MatchId';
  static readonly BET_ID = 'BetID(s)';
}

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit {
  @ViewChild('betIds') inputBetIds: InputBetIdsComponent;
  @ViewChild('bettypesComponent') betTypesComponent: BetTypesComponent;
  @ViewChild('fromDateTime') fromDateTimeComponent: DateFullTimeComponent;
  @ViewChild('toDateTime') toDateTimeComponent: DateFullTimeComponent;
  @Output() searchEvent = new EventEmitter<GetTicketsQuery>();
  tooltip = new Tooltip;
  option = [Option.MATCH_ID, Option.BET_ID];
  filterByMatchId = true;
  fromTransDate: string;
  toTransDate: string;
  matchId: string;
  betTypes: BetTypesModel;
  ballSequences = new BallSequences();
  preMatchId: string;
  isValidMatchId: boolean;
  sportType = 0;

  constructor(
    private element: ElementRef,
    private appService: AppService) {
    this.tooltip.element = this.element;
    this.getBetTypes();
  }

  ngOnInit(): void {
    this.setDateTime();
  }

  setDateTime() {
    const date = new Date();
    this.fromTransDate = moment(date).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    this.toTransDate = moment(date).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  getBetTypes() {
    const query: GetBetTypesQuery = { mode: ModeType.NUMBER_GAME, matchId: 0 };
    this.appService.getBetTypes(query)
      .subscribe(data => {
        this.betTypes = new BetTypesModel(data.bettypes, true);
      });
  }

  controlFilter(value: string) {
    this.resetFilter();
    this.filterByMatchId = value === Option.MATCH_ID;
  }

  blurMatchId() {
    this.isValidMatchId = false;

    if (this.matchId === undefined || this.matchId === '') {
      this.sportType = 0;
      return;
    }
    else if (this.matchId !== this.preMatchId) {
      this.preMatchId = this.matchId;
      this.getMatchInfo();
    }
    else if (this.sportType > 0) {
      this.checkMatchIsNumberGame();
    }
    else {
      this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
    }
  }

  getMatchInfo() {
    this.appService.getMatchInfo(this.matchId)
      .subscribe(data => {
        if (data === null) {
          this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
        }
        else {
          this.sportType = data.sportType;
          this.checkMatchIsNumberGame();
        }
      });
  }

  checkMatchIsNumberGame() {
    if (this.sportType !== 161 && this.sportType !== 164) {
      this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
    }

    this.isValidMatchId = true;
  }

  searchTickets() {
    if (this.filterByMatchId && !this.checkParamsByMatchId()) {
      return;
    }

    if (!this.filterByMatchId && !this.checkParamsByBetIds()) {
      return;
    }

    this.searchEvent.emit(this.getParams());
  }

  getParams(): GetTicketsQuery {
    return {
      option: !this.filterByMatchId,
      matchId: parseInt(this.matchId, 10),
      fromTransDate: this.fromTransDate,
      toTransDate: this.toTransDate,
      betTypes: this.betTypes.getCheckedBetTypes().join(','),
      ballSequence: this.ballSequences.value.join(','),
      transIds: this.filterByMatchId ? '' : this.inputBetIds.groupNumber.getValue(),
      pageIndex: PagingText.INDEX_ZERO,
      pageSize: PagingText.SIZE_DEFAULT
    };
  }

  checkParamsByMatchId(): boolean {

    if (this.matchId === '' || this.matchId === undefined) {
      this.tooltip.display('match-id', TEXT.REQUIRED_MATCHID);
      return false;
    }

    if (!this.isValidMatchId) {
      this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
      return false;
    }

    if(!this.fromDateTimeComponent.validateWithTooltip() || !this.toDateTimeComponent.validateWithTooltip()) {
      return false;
    }

    if (!this.isFromTransDateSameOfBeforeToTransDate()) {
      this.tooltip.display('from-date', TEXT.INVALID_TRANSDATE);
      return false;
    }
    else {
      return this.betTypesComponent.validate();
    }
  }

  checkParamsByBetIds(): boolean {
    if (this.inputBetIds.groupNumber.getValue() === '') {
      this.tooltip.display('invalid-betid', TEXT.REQUIRED_BETIDS);
      return false;
    }

    return true;
  }

  resetFilter() {
    this.sportType = 0;
    this.matchId = '';
    this.preMatchId = '';
    this.setDateTime();
    this.betTypes.isChecked = true;
    this.betTypes.changeAll();
    if (!this.filterByMatchId) {
      this.inputBetIds.groupNumber.items = [];
    }
  }

  private isFromTransDateSameOfBeforeToTransDate(): boolean {
    const momentFromTransDate = moment(this.fromTransDate, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const momentToTransDate = moment(this.toTransDate, DateTimeFormat.FULL_DATE_TIME_FORMAT);

    return momentFromTransDate.isSameOrBefore(momentToTransDate);
  }
}
