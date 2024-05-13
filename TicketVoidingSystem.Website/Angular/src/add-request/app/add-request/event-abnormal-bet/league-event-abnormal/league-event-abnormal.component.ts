import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { LeagueInfo, MatchInfo } from '../../../../../utility/models/event.model';
import { LeagueEventService } from '../../league-event/league-event.service';
import { MatchModel } from '../../../../../utility/models/match.model';

@Component({
  selector: 'league-event-abnormal',
  templateUrl: './league-event-abnormal.component.html',
  styleUrls: ['./league-event-abnormal.component.scss']
})
export class LeagueEventAbnormalComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() eventDate: string;
  @Input() actionId: string;
  @Input() initSportType: number;
  @Input() initMatchId: number;
  @Input() isShowLabel = true;
  leagues: LeagueInfo[];
  leagueId: number;
  matches: MatchInfo[];
  isBlock: boolean;
  tooltip = new Tooltip();
  selectedMatchId: number;
  selectedSportTypeId: number;

  constructor(
    private readonly leagueEventService: LeagueEventService,
    private readonly element: ElementRef
  ) {
    this.tooltip.element = this.element;
  }

  async ngOnInit() {
    if (this.isEdit) {
      await this.getMatchInEditPage(this.initSportType, this.eventDate, true, this.initMatchId, this.actionId);
    }
  }

  async getMatchInEditPage(sportType: number, eventDate: string, isEdit: boolean, matchId: number, actionId: string): Promise<void> {
    const viewModel = await this.leagueEventService.getMatch(sportType, eventDate, null, isEdit, matchId, Number(actionId));
    this.updateInfoWithOnlyOneMatch(this.getMatchInfo(viewModel.match));
  }

  getMatchInfo(match: MatchModel): MatchInfo {
    var matchInfo = new MatchInfo();
    matchInfo.matchId = match.matchId;
    matchInfo.name = match.name;
    matchInfo.sportType = match.sportType;
    matchInfo.matchCode = match.matchCode;
    matchInfo.parentId = match.parentId;
    matchInfo.kickOffTime = match.kickOffTime;
    matchInfo.leagueId = match.leagueId;
    matchInfo.leagueName = match.leagueName;

    return matchInfo;
  }
  
  updateUndefinedMatchAndLeague(): void {
    this.leagues = [];
    this.matches = [];
    this.selectedMatchId = undefined;
    this.selectedSportTypeId = undefined;
    this.leagueId = undefined;
  }

  public updateInfoWithOnlyOneMatch(match: MatchInfo): void {
    if (match) {
      this.matches = [match];
      this.selectedMatchId = match.matchId;
      this.selectedSportTypeId = match.sportType;
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
}
