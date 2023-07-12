import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { AcceptType, DateTimeFormat, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { LABELS } from '../../../../utility/constants/labels';
import { MatchInfo } from '../../../../utility/models/event.model';
import { StaticService } from '../../../../utility/services/static.service';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { LeagueEventRedCardComponent } from '../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../filter/filter.model';
import { WrongScoreModel } from '../models/event-wrong-score.model';
import { OthersModel } from '../others/others.model';
import { ConfirmWrongScoreModel } from './confirm-wrong-score/confirm-wrong-score.model';
import { PrimitiveProperty } from './event-wrong-score.model';
import { FilterWrongScoreComponent } from './filter-wrong-score/filter-wrong-score.component';
import { FilterWrongScoreModel } from './models/filter-wrong-score.model';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestArg } from './services/save-request.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationBusinessRuleArgs } from './services/validation.model';
import { ValidationService } from './services/validation.service';
import { WrongScoreService } from './services/wrong-score.service';
import { WrongScoreInfoComponent } from './wrong-score-info/wrong-score-info.component';

@Component({
  selector: 'event-wrong-score',
  templateUrl: './event-wrong-score.component.html',
  styleUrls: ['./event-wrong-score.component.scss']
})
export class EventWrongScoreComponent implements OnInit, OnChanges {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() matchId: number;
  @Input() isVoided: boolean;
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() wrongScoreModels: WrongScoreModel[] = [];
  @Output() updateMatchId = new EventEmitter<MatchInfo>();
  @ViewChild('leagueEvent') leagueEventWrongScoreComponent: LeagueEventRedCardComponent;
  @ViewChildren('wrongScoreInfo') wrongScoreInfoComponents: QueryList<WrongScoreInfoComponent>;
  @ViewChild('filterWrongScore') filterWrongScoreComponent: FilterWrongScoreComponent;

  private readonly errorTooltipClassName = 'var-check-selection';

  primitiveProps = new PrimitiveProperty();
  tooltip = new Tooltip();
  originWrongScoreModels: WrongScoreModel[] = [];
  confirmWrongScoreModel = new ConfirmWrongScoreModel();
  filterWrongScoreModel: FilterWrongScoreModel;
  getAllowanceTimeSubscription: Subscription;
  acceptTypeName = "";

  constructor(
    private readonly element: ElementRef,
    private readonly addRequestApiService: AddRequestApiService,
    private readonly addRequestStore: AddRequestStore,
    private readonly validationService: ValidationService,
    private readonly saveRequestService: SaveRequestService,
    private readonly wrongScoreService: WrongScoreService,
    private readonly logInfoService: LogInfoService,
    private readonly modalService: ModalService,
  ) {
    this.tooltip.element = this.element;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filter'] && this.filter.isChangeSubTypeManual) {
      this.primitiveProps.filterBy = this.wrongScoreService.getFilterByBaseOnSubIssueType(this.filter.subIssueTypeId);
      this.primitiveProps.isCheckedVar = null;
      this.primitiveProps.isHighLightVarCheck = null;
      this.resetData();
      this.filter.isChangeSubTypeManual = false;
      this.addRequestStore.changeSavingRequestStatus(true);
    }
  }

  public async ngOnInit(): Promise<void> {
    this.getAllowanceTimeSubscription = this.addRequestStore.getAllowanceTimeSubject.subscribe(model => {
      this.filterWrongScoreModel.allowanceTime = model;
    });
    if (this.isEdit) {
      this.matchId = this.wrongScoreModels[0].matchId;
      this.primitiveProps.actualScore = this.wrongScoreModels[0].actualScore;
      this.primitiveProps.filterBy = this.wrongScoreModels[0].filterBy;
      this.primitiveProps.isShowActualScore = true;
      this.primitiveProps.isCheckedVar = this.wrongScoreModels[0].isCheckedVar;
      this.primitiveProps.isHighLightVarCheck = !this.wrongScoreModels[0].isCheckedVar;
      this.filterWrongScoreModel = this.wrongScoreService.getFilterWrongScore(this.wrongScoreModels[0]);
      await this.updateWrongScoreModels();
    } else {
      this.filterWrongScoreModel = this.wrongScoreService.initDefaultFilterWrongScore();
      this.addRequestStore.changeSavingRequestStatus(true);
    }
  }

  public async handleSearchEvent(): Promise<void> {
    if (this.wrongScoreModels) {
      this.logInfoService.clearDataValidation(this.wrongScoreModels);
    }

    if (!this.validationService.validateCommonData(this.filter, this.leagueEventWrongScoreComponent, this.addRequestStore, this.filterWrongScoreComponent,
      this.wrongScoreService.getSelectedWrongScoreComponents(this.wrongScoreInfoComponents))) {
      return;
    }

    if (this.primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME) {
      this.wrongScoreModels = [this.wrongScoreService.createMainWrongScoreModel(this.filterWrongScoreModel)];
      this.primitiveProps.isBlock = true;
      this.logInfoService.clearDataValidation(this.wrongScoreModels);
      await this.logInfoService.getLogInfo(this.isEdit, this.requestId, this.matchId, this.filter, this.primitiveProps, this.wrongScoreModels);
      this.primitiveProps.isBlock = false;
    } else {
      await this.getWrongScores(this.matchId);
    }

    this.primitiveProps.isShowActualScore = true;
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public async updateWrongScoreModels(): Promise<void> {
    this.originWrongScoreModels = await this.callApiGetWrongScores(this.matchId);
    this.originWrongScoreModels.forEach(x => {
      const model = this.wrongScoreModels.find(y => y.scoreId === x.scoreId);
      if (model) {
        model.isActive = x.isActive;
      } else {
        this.wrongScoreModels.push(_.cloneDeep(x));
      }
    });
    this.wrongScoreModels = _.orderBy(_.uniqBy(this.wrongScoreModels, x => x.scoreId), ['scoreId'], ['asc']);
  }

  public updateByOriginWrongScoreModel(originWrongScoreModels: WrongScoreModel[]) {
    originWrongScoreModels.forEach(x => {
      if (!this.wrongScoreModels.some(y => y.scoreId === x.scoreId)) {
        this.wrongScoreModels.push(_.cloneDeep(x));
      }
    });
    this.wrongScoreModels = _.orderBy(_.uniqBy(this.wrongScoreModels, x => x.scoreId), ['scoreId'], ['asc']);
  }

  public changeMatchEvent(matchInfo: MatchInfo) {
    if (matchInfo) {
      this.resetData();
      this.matchId = matchInfo.matchId;
      this.updateMatchId.emit(matchInfo);
    }
  }

  public resetData(): void {
    this.wrongScoreModels = [];
    this.primitiveProps.isShowActualScore = false;
    this.primitiveProps.actualScore = '';
  }

  public async getWrongScores(matchId: number): Promise<void> {
    this.originWrongScoreModels = await this.callApiGetWrongScores(matchId);
    if (this.originWrongScoreModels.length > 0) {
      this.wrongScoreModels = _.cloneDeep(this.originWrongScoreModels);
    }
  }

  private async callApiGetWrongScores(matchId: number): Promise<WrongScoreModel[]> {
    this.primitiveProps.isBlock = true;
    const data = await this.addRequestApiService.getWrongScores(matchId);
    this.primitiveProps.isBlock = false;

    return data;
  }

  public triggerCloseEvent() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public async saveRequest(): Promise<void> {
    if (!this.validateVarCheck()) {
      this.addRequestStore.changeSavingRequestStatus(false);
      return;
    }

    this.primitiveProps.isShowActualScore = true;
    if (this.filter.isVoided) {
      await this.checkIfRequestHasWarning();
      return;
    }

    await this.saveWhenRequestNotVoided();
  }

  public async onYesConfirmAddRequest(): Promise<void> {
    this.saveRequestService.onYesConfirmAddRequest(this.createSaveRequestArg());
  }

  public isShowLogInfoFilterByAcceptedTime(): boolean {
    if (this.wrongScoreModels?.length === 0 || this.primitiveProps.filterBy !== 2) {
      return false;
    }

    return this.wrongScoreModels[0].logInfoDetail !== null || this.wrongScoreModels[0].messageValidationLogInfo?.length > 0;
  }

  private openConfirmWrongScore(isHasWarningSettledTicket: boolean, isHasWarningForWrongScore: boolean, isHasWarningEditTakeNoteRequest: boolean,
    isEditingByAnotherUser: boolean): void {
    this.confirmWrongScoreModel.isOpenDialog = true;
    this.confirmWrongScoreModel.isHasWarningSettledTicket = isHasWarningSettledTicket;
    this.confirmWrongScoreModel.isHasWarningForWrongScore = isHasWarningForWrongScore;
    this.confirmWrongScoreModel.isHasWarningEditTakeNoteRequest = isHasWarningEditTakeNoteRequest;
    this.confirmWrongScoreModel.isEditingByAnotherUser = isEditingByAnotherUser;
    this.confirmWrongScoreModel.requestId = this.requestId;
    this.confirmWrongScoreModel.requestedBy = this.requestedBy;

    this.confirmWrongScoreModel = _.clone(this.confirmWrongScoreModel);
  }

  /* istanbul ignore next */
  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);  }

  private async saveWhenRequestNotVoided(): Promise<void> {
    const validation = await this.saveRequestService.checkValidationBeforeSaveRequest(this.createValidationBusinessRuleArgs());
    if (validation.isValid) {
      await this.checkIfRequestHasWarning();
    } else {
      this.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  private async checkIfRequestHasWarning(): Promise<void> {
    const isHasWarningSettledTicket = this.validationService.isHasWarningSettledTicket(this.wrongScoreService.getSelectedWrongScores(this.wrongScoreModels));
    const isHasWarningForWrongScore = this.validationService.isValidationHasWarningTicket(this.wrongScoreService.getSelectedWrongScores(this.wrongScoreModels));
    const isHasWarningEditTakeNoteRequest = this.validationService.isHasWarningEditTakeNoteRequest(this.isEdit, this.filter.action, this.actionIdOfFirstTimeAccess);
    const isEditingByAnotherUser =
      this.validationService.isEditingByAnotherUser(this.isEdit, Number(document.getElementById('body').getAttribute('user-id')), this.userId);
    if (isHasWarningSettledTicket || isHasWarningForWrongScore || isHasWarningEditTakeNoteRequest) {
      this.openConfirmWrongScore(isHasWarningSettledTicket, isHasWarningForWrongScore, isHasWarningEditTakeNoteRequest, isEditingByAnotherUser);
    } else {
      await this.saveRequestService.saveRequest(this.createSaveRequestArg());
    }
  }

  private createSaveRequestArg(): SaveRequestArg {
    const args = new SaveRequestArg();
    args.requestId = this.requestId;
    args.isEdit = this.isEdit;
    args.isVoided = this.isVoided;
    args.filter = this.filter;
    args.others = this.others;
    args.primitiveProps = this.primitiveProps;
    args.wrongScoreModels = this.wrongScoreService.getSelectedWrongScores(this.wrongScoreModels);
    args.wrongScoreInfoComponents = this.wrongScoreService.getSelectedWrongScoreComponents(this.wrongScoreInfoComponents);
    args.leagueEventWrongScoreComponent = this.leagueEventWrongScoreComponent;
    args.filterWrongScoreComponent = this.filterWrongScoreComponent;
    args.addRequestStore = this.addRequestStore;
    args.tooltip = this.tooltip;

    return args;
  }

  private createValidationBusinessRuleArgs(): ValidationBusinessRuleArgs {
    const args = new ValidationBusinessRuleArgs();
    args.requestId = this.requestId;
    args.isEdit = this.isEdit;
    args.filter = this.filter;
    args.primitiveProps = this.primitiveProps;
    args.wrongScoreModels = this.wrongScoreService.getSelectedWrongScores(this.wrongScoreModels);
    args.wrongScoreInfoComponents = this.wrongScoreService.getSelectedWrongScoreComponents(this.wrongScoreInfoComponents);
    args.leagueEventWrongScoreComponent = this.leagueEventWrongScoreComponent;
    args.filterWrongScoreComponent = this.filterWrongScoreComponent;
    args.addRequestStore = this.addRequestStore;
    args.tooltip = this.tooltip;

    return args;
  }

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  getHighlightMinTimeClass(minTime?: Date): string {
    if (minTime && this.wrongScoreModels[0].logInfoDetail.highlightAcceptType) {
      switch (this.wrongScoreModels[0].logInfoDetail.highlightAcceptType) {
        case AcceptType.AUTO_ACCEPT: {
          this.acceptTypeName = "AA";
          return 'highlight-min-aa';
        }
        case AcceptType.SECOND_ACCEPT: {
          this.acceptTypeName = "SA";
          return 'highlight-min-sa';
        }
        case AcceptType.PENDING_ACCEPT: {
          this.acceptTypeName = "PA";
          return 'highlight-min-pa';
        }
      }
    }

    return '';
  }

  public updateStatusButtonSaveRequest(): void {
    this.addRequestStore.changeSavingRequestStatus(this.wrongScoreModels.every(x => !x.isChecked));
  }

  isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  displayMinTime(minTime?: Date): string {
    if (_.isNull(minTime)) {
      return '-';
    }
    return (this.acceptTypeName) ? `${moment(minTime).format(DateTimeFormat.TIME_FORMAT)} - ${this.acceptTypeName}` :
      `${moment(minTime).format(DateTimeFormat.TIME_FORMAT)}`;
  }

  isShowVarCheck() {
    return this.filter.subIssueTypeId && StaticService.isShowVarCheck(Number(this.filter.subIssueTypeId));
  }

  changeVarCheckValue(isVarChecked: boolean): void {
    this.primitiveProps.isCheckedVar = isVarChecked;
    this.primitiveProps.isHighLightVarCheck = false;
  }

  validateVarCheck(): boolean {
    if (this.isShowVarCheck() && (_.isNull(this.primitiveProps.isCheckedVar) || _.isUndefined(this.primitiveProps.isCheckedVar))) {
      this.primitiveProps.isHighLightVarCheck = true;
      this.tooltip.display(this.errorTooltipClassName, LABELS.SELECTED_VAR_OPTIONS);
      return false;
    }

    return true;
  }

  isShowLogInfoSelectedScores(wrongScoreModels: WrongScoreModel[]): boolean {
    if (wrongScoreModels.filter(x => x.isChecked).length > 1) {
      return true;
    }
    return false;
  }

  getSingleCountSelectedScore(wrongScoreModels: WrongScoreModel[]): number {
    let totalSingleCount = 0;
    wrongScoreModels.filter(x => x.isChecked).forEach(wrongScoreModel => {
      totalSingleCount += (wrongScoreModel.logInfoDetail) ? wrongScoreModel.logInfoDetail.singleCount : 0;
    });

    return totalSingleCount;
  }

  getParlayCountSelectedScore(wrongScoreModels: WrongScoreModel[]): number {
    let totalParlayCount = 0;
    wrongScoreModels.filter(x => x.isChecked).forEach(wrongScoreModel => {
      totalParlayCount += (wrongScoreModel.logInfoDetail) ? wrongScoreModel.logInfoDetail.mainParlayCount : 0;
    });
    return totalParlayCount;
  }
  getCancelCashOutCountSelectedScore(wrongScoreModels: WrongScoreModel[]): number {
    let totalCancelCashOutCount = 0;
    wrongScoreModels.filter(x => x.isChecked).forEach(wrongScoreModel => {
      totalCancelCashOutCount += (wrongScoreModel.logInfoDetail) ? wrongScoreModel.logInfoDetail.cancelCashOutCount : 0;
    });
    return totalCancelCashOutCount;
  }

  getTimeSelectedScore(wrongScoreModels: WrongScoreModel[]): string {
    let fromTime = '';
    let toTime = '';
    if (wrongScoreModels.filter(x => x.isChecked)[0].logInfoDetail) {
      fromTime = this.displayFullDateTimeFormat(wrongScoreModels.filter(x => x.isChecked)[0].logInfoDetail.voidFromTime);
    }
    if (wrongScoreModels.filter(x => x.isChecked)[wrongScoreModels.filter(x => x.isChecked).length - 1].logInfoDetail) {
      toTime = this.displayFullDateTimeFormat(wrongScoreModels.filter(x => x.isChecked)[wrongScoreModels.filter(x => x.isChecked).length - 1].logInfoDetail.voidToTime);
    }
    return `${fromTime} - ${toTime}`;
  }
}
