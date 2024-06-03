import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Subscription, timer } from 'rxjs';
import { isNumeric } from 'rxjs/internal/util/isNumeric';
import { MatchModel } from 'src/utility/models/match.model';
import { LABELS } from '../../../utility/constants/labels';
import { CommonService } from '../../../utility/services/common.service';
import { Tooltip } from '../tooltip/tooltip.model';

@Component({
  selector: 'event-league',
  templateUrl: './event-league.component.html',
  styleUrls: ['./event-league.component.scss']
})

export class EventLeagueComponent implements OnChanges {
  @Input() isEdit: boolean;
  @Input() matchId: number;
  @Output() changeEvent = new EventEmitter<MatchModel>();

  selectedMatch = new MatchModel();
  matches: MatchModel[];
  isBlock: boolean;
  tooltip = new Tooltip();
  validationMessage: string;

  private delayForSearchSubscription: Subscription;
  private readonly observableTimer = timer(300);

  constructor(
    private readonly commonService: CommonService,
    private readonly element: ElementRef
  ) {
    this.tooltip.element = this.element;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.matchId && (changes['matchId'])) {
      await this.getMatchInEditPage(this.matchId);
    }
  }

  async getMatchInEditPage(matchId: number): Promise<void> {
    const viewModel = await this.commonService.getMatchInfoAddRequestTvs(matchId);
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
        const model = await this.commonService.getMatchInfoAddRequestTvs(Number(keyword.term));
        if (model.errorCode === 0) {
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

  onChangeMatchEvent(match: MatchModel) {
    this.selectedMatch = match;
    this.changeEvent.emit(match);
  }

  private updateInfoWithOnlyOneMatch(match: MatchModel): void {
    if (match) {
      this.matches = [match];
      this.selectedMatch = match;
    } else {
      this.updateUndefinedMatchAndLeague();
    }
  }

  updateUndefinedMatchAndLeague() {
    this.matches = [];
    this.selectedMatch = new MatchModel();
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
