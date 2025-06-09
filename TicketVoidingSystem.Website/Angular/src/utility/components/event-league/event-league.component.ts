import { _isNumberValue } from '@angular/cdk/coercion';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { Subscription, timer } from 'rxjs';
import { AddRequestStore } from '../../../add-request/app/add-request/add-request.store';
import { LABELS } from '../../../utility/constants/labels';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonService } from '../../../utility/services/common.service';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { Tooltip } from '../tooltip/tooltip.model';
import { ValidationService } from './validation.service';

@Component({
  standalone: true,
  selector: 'event-league',
  templateUrl: './event-league.component.html',
  styleUrls: ['./event-league.component.scss'],
  imports: [FormsModule, NgSelectModule, TooltipComponent],
  providers: [ValidationService]
})

export class EventLeagueComponent implements OnChanges {
  @Input() isEdit: boolean;
  @Input() matchId: number;
  @Input() isShowSportType = true;
  @Input() subIssueTypeId?: string;
  @Output() changeEvent = new EventEmitter<MatchModel>();
  
  selectedMatch = new MatchModel();
  matches: MatchModel[];
  isBlock: boolean;
  tooltip = new Tooltip();
  validationMessage: string;
  warningSubType: string;
  isShowWarningSubType = false;
  
  private delayForSearchSubscription: Subscription;
  private readonly observableTimer = timer(300);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly commonService = inject(CommonService);
  private readonly element = inject(ElementRef);
  private readonly validationService = inject(ValidationService);

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.isEdit && this.matchId && (changes['matchId'])) {
      await this.getMatchInEditPage(this.matchId);
    }
    if((changes['subIssueTypeId'])) {
      this.isShowWarningSubType = !this.isValidSubType();
    }
  }

  isValidSubType(){
    return !this.selectedMatch.matchId || !this.subIssueTypeId
      || this.validationService.checkValidSubType(this.subIssueTypeId, this.selectedMatch?.subtype);
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
      } else if (_isNumberValue(keyword.term)) {
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
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    this.selectedMatch = match;
    this.isShowWarningSubType = !this.isValidSubType();
    this.changeEvent.emit(match);
  }

  public updateInfoWithOnlyOneMatch(match: MatchModel): void {
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