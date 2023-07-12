import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import { Subscription, timer } from 'rxjs';
import { isNumeric } from 'rxjs/internal/util/isNumeric';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../../utility/constants/labels';
import { LeagueInfo, MatchInfo } from '../../../../utility/models/event.model';
import { LeagueEventService } from './league-event.service';

@Component({
  selector: 'league-event',
  templateUrl: './league-event.component.html',
  styleUrls: ['./league-event.component.scss']
})
export class LeagueEventComponent implements OnChanges {
  @Input() isEdit: boolean;
  @Input() isAbnormal: boolean;
  @Input() sportType: number;
  @Input() eventDate: string;
  @Input() actionId: string;
  @Input() matchId: number;

  @Output() matchIdChange = new EventEmitter<number>();
  @Output() changeEvent = new EventEmitter();
  @Output() changeMatchInfo = new EventEmitter<MatchInfo>();
  @Output() changeSportTypeAbnormal = new EventEmitter<number>();

  leagues: LeagueInfo[];
  leagueId: number;
  matches: MatchInfo[];
  isBlock: boolean;
  tooltip = new Tooltip();
  validationMessage: string;
  
  private delayForSearchSubscription: Subscription;
  private readonly observableTimer = timer(300);

  constructor(
    private readonly leagueEventService: LeagueEventService,
    private readonly element: ElementRef
  ) {
    this.tooltip.element = this.element;
  }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['sportType'] || changes['eventDate'] || changes['isAbnormal']) {
      await new Promise(re => setTimeout(re));
      if (this.isEdit) {
        await this.getMatchFromMatchId();
      } else {
        this.updateUndefinedMatchAndLeague();
        this.changeEvent.emit();
      }
    }
  }

  onSearchMatch(keyword: { term: string }) {
    this.isBlock = true;
    if (this.delayForSearchSubscription) {
      this.delayForSearchSubscription.unsubscribe();
    }

    this.delayForSearchSubscription = this.observableTimer.subscribe(async () => {
      if (_.isNull(keyword.term) || _.isEmpty(keyword.term)) {
        this.validationMessage = '';
      } else if (isNumeric(keyword.term)) {
        const viewModel = await this.leagueEventService.getMatch(this.sportType, this.eventDate, null, null, Number(keyword.term), null);
        if(viewModel.errorCode === 0) {
          this.matches = [viewModel.match];
        } else {
          this.matches = [];
          this.validationMessage = viewModel.errorMsg;
        }
      } else {
        this.matches = [];
        this.validationMessage = LABELS.INVALID_MATCHID;
      }

      this.isBlock = false;
    });
  }

  blurMatchSelect(): void {
    this.validationMessage = '';
  }

  onChangeMatchEvent(match: MatchInfo) {
    this.updateLeagueInfo(match.leagueId, match.leagueName);
    this.changeMatchInfo.emit(match);
    this.matchIdChange.emit(match.matchId);
    this.changeEvent.emit();
  }

  async getMatchFromMatchId(): Promise<void> {
    const viewModel = await this.leagueEventService.getMatch(this.sportType, this.eventDate, null, this.isEdit,
      this.matchId, Number(this.actionId));
    this.changeMatchInfo.emit(viewModel.match);
    this.updateInfoWithOnlyOneMatch(viewModel.match);
  }

  async getMatchFromTransIds(transIds: string): Promise<void> {
    const defaultDate = '2001/1/1';
    const viewModel = await this.leagueEventService.getMatch(null, defaultDate, transIds, this.isEdit, null,
      Number(this.actionId));
    this.changeMatchInfo.emit(viewModel.match);
    this.updateInfoWithOnlyOneMatch(viewModel.match);
  }

  private updateInfoWithOnlyOneMatch(match: MatchInfo): void { 
    if (match) {
      this.matches = [match];
      this.matchId = match.matchId;
      this.changeSportTypeAbnormal.emit(match.sportType);
      this.matchIdChange.emit(match.matchId);
      this.updateLeagueInfo(match.leagueId, match.leagueName);
    } else {
      this.updateUndefinedMatchAndLeague();
    }
  }

  private updateLeagueInfo(leagueId: number, leagueName: string): void {
    const league: LeagueInfo = {
      leagueId: leagueId,
      leagueName: leagueName
    };

    this.leagues = [];
    this.leagues.push(league);
    this.leagueId = league.leagueId;
  }

  updateUndefinedMatchAndLeague() {
    this.leagues = [];
    this.matches = [];
    this.matchId = undefined;
    this.matchIdChange.emit(null);
    this.leagueId = undefined;
  }

  isMatchIdValid(): boolean {
    if (!this.matchId) {
      this.tooltip.display('match-id', LABELS.REQUIRED_MATCHID);
      return false;
    } else {
      return true;
    }
  }
}
