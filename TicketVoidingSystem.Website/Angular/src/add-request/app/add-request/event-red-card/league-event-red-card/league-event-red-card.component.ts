import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import { Subscription, timer } from 'rxjs';
import { isNumeric } from 'rxjs/internal/util/isNumeric';
import { LABELS } from '../../../../../utility/constants/labels';
import { LeagueInfo, MatchInfo } from '../../../../../utility/models/event.model';
import { Tooltip } from '../../../../../utility/modules/tooltip/tooltip.model';
import { LeagueEventService } from '../../league-event/league-event.service';

@Component({
  selector: 'league-event-red-card',
  templateUrl: './league-event-red-card.component.html',
  styleUrls: ['./league-event-red-card.component.scss']
})
export class LeagueEventRedCardComponent implements OnChanges {
  @Input() isEdit: boolean;
  @Input() eventDate: string;
  @Input() actionId: string;
  @Input() initSportType: number;
  @Input() initMatchId: number;
  @Output() changeEvent = new EventEmitter<MatchInfo>();

  selectedMatch = new MatchInfo();
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
    if (!this.isEdit && ( changes['sportType'] || changes['eventDate'])) {
        this.updateUndefinedMatchAndLeague();
        this.changeEvent.emit();     
    }
    if (this.isEdit && this.initMatchId && ( changes['initMatchId'])) {
      await this.getMatchInEditPage(this.initSportType, this.eventDate, true, this.initMatchId, this.actionId);  
    }
  }

  async getMatchInEditPage(sportType: number, eventDate: string, isEdit: boolean, matchId: number, actionId: string): Promise<void> {
    const viewModel = await this.leagueEventService.getMatch(sportType, eventDate, null, isEdit, matchId, Number(actionId));
    this.updateInfoWithOnlyOneMatch(viewModel.match);
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
        const model = await this.leagueEventService.getMatch(this.initSportType, this.eventDate, null, this.isEdit, Number(keyword.term), null);
        if(model.errorCode === 0) {
          this.matches = [model.match];
        } else {
          this.matches = [];
          this.validationMessage = model.errorMsg;
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
    this.selectedMatch = match;
    this.changeEvent.emit(match);
  }

  private updateInfoWithOnlyOneMatch(match: MatchInfo): void {
    if (match) {
      this.matches = [match];
      this.selectedMatch = match;
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
    this.selectedMatch = new MatchInfo();
    this.leagueId = undefined;
  }

  isMatchIdValid(): boolean {
    if (!this.selectedMatch.matchId) {
      this.tooltip.display('match-id', LABELS.REQUIRED_MATCHID);
      return false;
    } else {
      return true;
    }
  }
}
