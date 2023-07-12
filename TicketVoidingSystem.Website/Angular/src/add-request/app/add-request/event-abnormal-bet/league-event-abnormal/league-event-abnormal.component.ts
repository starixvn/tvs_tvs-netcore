import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { LeagueInfo, MatchInfo } from '../../../../../utility/models/event.model';
import { Tooltip } from '../../../../../utility/modules/tooltip/tooltip.model';
import { LeagueEventService } from '../../league-event/league-event.service';

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
    this.updateInfoWithOnlyOneMatch(viewModel.match);
  }

  // async getMatchFromTransIds(transIds: string): Promise<void> {
  //   const defaultDate = '2001/1/1';
  //   const viewModel = await this.leagueEventService.getMatch(null, defaultDate, transIds, this.isEdit, null,
  //     Number(this.actionId));
  //   this.updateInfoWithOnlyOneMatch(viewModel.match);
  // }

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
