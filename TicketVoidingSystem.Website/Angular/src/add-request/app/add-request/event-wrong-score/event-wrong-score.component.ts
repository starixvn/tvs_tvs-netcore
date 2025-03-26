import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { Subscription } from 'rxjs';
import { AddChildMatchComponent } from 'src/utility/components/add-child-match/add-child-match.component';
import { BlockUiDirective } from 'src/utility/components/block-ui/block-ui.directive';
import { TooltipComponent } from 'src/utility/components/tooltip/tooltip.component';
import { PipeModule } from 'src/utility/pipes/pipe.module';
import { AddChildMatchModel } from '../../../../utility/components/add-child-match/add-child-match.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { ModalService } from '../../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, MatchType, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { LABELS } from '../../../../utility/constants/labels';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { StaticService } from '../../../../utility/services/static.service';
import { AddRequestStore } from '../add-request.store';
import { LogInfoRelatedEventComponent } from '../components/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../components/log-info-related-event/log-info-related-event.model';
import { TvDetectionComponent } from '../components/tv-detection/tv-detection.component';
import { TvDetectionModel } from '../components/tv-detection/tv-detection.model';
import { FilterTimeWithAllowance } from '../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { WrongScoreModel } from '../models/event-wrong-score.model';
import { ChildMatchModel } from '../models/related-event.model';
import { OthersModel } from '../others/others.model';
import { ConfirmWrongScoreComponent } from './confirm-wrong-score/confirm-wrong-score.component';
import { ConfirmWrongScoreModel } from './confirm-wrong-score/confirm-wrong-score.model';
import { PrimitiveProperty } from './event-wrong-score.model';
import { FilterWrongScoreComponent } from './filter-wrong-score/filter-wrong-score.component';
import { AddRelatedEventArg } from './models/add-related-event.model';
import { EditRequestService } from './services/edit-request.service';
import { EventWrongScoreService } from './services/event-wrong-score.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestArg } from './services/save-request.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationBusinessRuleArgs } from './services/validation.model';
import { ValidationService } from './services/validation.service';
import { WrongScoreService } from './services/wrong-score.service';
import { WrongScoreInfoComponent } from './wrong-score-info/wrong-score-info.component';

@Component({
  standalone: true,
  selector: 'event-wrong-score',
  templateUrl: './event-wrong-score.component.html',
  styleUrls: ['./event-wrong-score.component.scss'],
  imports: [EventLeagueComponent, TvDetectionComponent, FilterWrongScoreComponent, WrongScoreInfoComponent, PipeModule, ConfirmWrongScoreComponent,
    LogInfoRelatedEventComponent, AddChildMatchComponent, CommonModule, FormsModule, TooltipComponent, BlockUiDirective],
  providers: [EventWrongScoreService, LogInfoService, SaveRequestService, ValidationService, WrongScoreService, RelatedEventService, EditRequestService]
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
  @Input() issueTypes = new IssueTypes();
  @Output() updateMatchId = new EventEmitter<MatchModel>();
  @ViewChild('tvDetection') tvDetectionComponent: TvDetectionComponent;
  @ViewChild('eventLeague') eventLeagueComponent: EventLeagueComponent;
  @ViewChildren('wrongScoreInfo') wrongScoreInfoComponents: QueryList<WrongScoreInfoComponent>;
  @ViewChild('filterWrongScore') filterWrongScoreComponent: FilterWrongScoreComponent;
  @ViewChildren('logInfo') logInfoComponents: QueryList<LogInfoRelatedEventComponent>;

  private readonly errorTooltipClassName = 'var-check-selection';
  private readonly INPUT_MATCH_ID_CLASS = 'input-related-match-id';

  primitiveProps = new PrimitiveProperty();
  tooltip = new Tooltip();
  originWrongScoreModels: WrongScoreModel[] = [];
  confirmWrongScoreModel = new ConfirmWrongScoreModel();
  tvDetectionModel = new TvDetectionModel();
  getAllowanceTimeSubscription: Subscription;
  acceptTypeName = "";
  allRelatedEvents: LogInfoRelatedEvent[] = [];
  addChildMatchModel = new AddChildMatchModel();
  relatedEvents: ChildMatchModel[] = [];
  defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
  mainEvent = new WrongScoreModel();
  private readonly element = inject(ElementRef);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly validationService = inject(ValidationService);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly wrongScoreService = inject(WrongScoreService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly modalService = inject(ModalService);
  private readonly relatedEventService = inject(RelatedEventService);
  private readonly editRequestService = inject(EditRequestService);
  private readonly eventWrongScoreService = inject(EventWrongScoreService);

  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filter'] && this.filter.isChangeSubTypeManual) {
      this.eventWrongScoreService.resetPrimitiveProperty(this.primitiveProps, this.filter.subIssueTypeId);
      this.tvDetectionComponent?.initDefaultValues();
      this.resetData();
      this.filter.isChangeSubTypeManual = false;
    }
  }

  public async ngOnInit(): Promise<void> {
    this.getAllowanceTimeSubscription = this.addRequestStore.getAllowanceTimeSubject.subscribe(model => {
      this.defaultFilterTimeWithAllowance.aaTime = model.aaTime;
      this.defaultFilterTimeWithAllowance.paTime = model.paTime;
      this.defaultFilterTimeWithAllowance.saTime = model.saTime;
    });
    if (this.isEdit) {
      this.mainEvent = this.editRequestService.getMainWrongScoreModel(this.wrongScoreModels);
      this.matchId = this.mainEvent.matchId;
      this.editRequestService.assignPrimitivePropsEditRequest(this.mainEvent, this.primitiveProps);
      if (this.mainEvent.filterBy === TVSRequestFilterBy.CHECK_TIME) {
        this.allRelatedEvents = await this.editRequestService.getAllRelatedEvents(this.wrongScoreModels, this.mainEvent, this.relatedEvents);
        this.wrongScoreModels = [this.mainEvent]
      }
      else {
        this.originWrongScoreModels = await this.editRequestService.getScoreWrongScoreModels(this.wrongScoreModels, this.matchId);
      }
      this.defaultFilterTimeWithAllowance = this.wrongScoreService.getFilterWrongScore(this.mainEvent);
      this.tvDetectionModel = this.eventWrongScoreService.getTvDetectionModel(this.mainEvent);
    } else {
      this.defaultFilterTimeWithAllowance = this.wrongScoreService.initDefaultFilterWrongScore();
      this.addRequestStore.changeSavingRequestStatus(true);
    }
  }

  private initAddRelatedEventArgs() {
    const arg = new AddRelatedEventArg();
    arg.tooltip = this.tooltip;
    arg.requestId = this.requestId;
    arg.isEdit = this.isEdit;
    arg.filter = this.filter;
    arg.primitiveProps = this.primitiveProps;
    arg.defaultFilterTimeWithAllowance = this.defaultFilterTimeWithAllowance;
    arg.allEvents = this.allRelatedEvents;
    this.wrongScoreModels[0].eventDate = this.mainEvent.eventDate;
    this.wrongScoreModels[0].matchId = this.matchId;
    arg.mainEvent = this.wrongScoreModels[0];
    arg.addRequestStore = this.addRequestStore;
    arg.inputMatchIdClass = this.INPUT_MATCH_ID_CLASS;

    return arg;
  }

  public async handleSearchEvent(): Promise<void> {
    if (!this.validationService.isValidAllSubIssueType(this.logInfoComponents)) {
      return;
    }

    if (this.wrongScoreModels) {
      this.logInfoService.clearDataValidation(this.wrongScoreModels, this.allRelatedEvents);
    }

    if (!this.validationService.validateCommonData(this.filter, this.eventLeagueComponent, this.addRequestStore, this.filterWrongScoreComponent,
      this.wrongScoreService.getSelectedWrongScoreComponents(this.wrongScoreInfoComponents), this.tvDetectionComponent)) {
      return;
    }

    this.primitiveProps.isBlock = true;
    if (this.primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME) {
      if (this.wrongScoreModels.length === 0) {
        this.wrongScoreModels = [this.wrongScoreService.createMainWrongScoreModel(this.defaultFilterTimeWithAllowance)];
        this.wrongScoreModels[0].isMainMatch = true;
      }
      this.relatedEvents = await this.relatedEventService.getGetInfoChildMatch(this.mainEvent.matchId, true, this.mainEvent.sportType, this.mainEvent.eventDate.toString());
      await this.relatedEventService.getDataRelatedEventWhenSearch(this.relatedEvents, this.initAddRelatedEventArgs());
      this.logInfoComponents.forEach(x => {
        x.filterTimeWithAllowanceComponent?.updateData();
        x.showValidationDetail();
      });
    }
    else {
      this.originWrongScoreModels = await this.eventWrongScoreService.getAllWrongScoreModels(this.wrongScoreModels, this.matchId);
    }
    this.primitiveProps.isShowRelatedEvents = this.eventWrongScoreService.isHasRelatedEvent(Number(this.filter.subIssueTypeId));
    this.primitiveProps.isBlock = false;
    this.primitiveProps.isShowActualScore = true;
    this.updateStatusButtonSaveRequest();
  }

  public async updateWrongScoreModels(): Promise<void> {
    this.originWrongScoreModels = await this.wrongScoreService.callApiGetWrongScores(this.matchId);
    this.wrongScoreService.mapWrongScoreModel(this.originWrongScoreModels, this.wrongScoreModels);
  }

  actualTimeChange(actualTime: string) {
    this.filterWrongScoreComponent.fromTimeComponent.time = moment(actualTime, DateTimeFormat.SIMPLE_TIME_FORMAT).format(DateTimeFormat.TIME_FORMAT);
    this.resetData();
    this.addRequestStore.changeSavingRequestStatus(true);
  }

  public updateByOriginWrongScoreModel(originWrongScoreModels: WrongScoreModel[]) {
    this.wrongScoreService.updateByOriginWrongScoreModel(originWrongScoreModels, this.wrongScoreModels);
  }

  public changeMatchEvent(matchInfo: MatchModel) {
    if (matchInfo) {
      this.resetData();
      this.matchId = matchInfo.matchId;
      this.eventWrongScoreService.updateMainMatch(this.mainEvent, matchInfo);
      this.updateMatchId.emit(matchInfo);
    }
  }

  public resetData(): void {
    this.wrongScoreModels = [];
    this.primitiveProps.isShowActualScore = false;
    this.primitiveProps.actualScore = '';
    this.allRelatedEvents = [];
    this.relatedEvents = [];
  }

  public triggerCloseEvent() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public async saveRequest(): Promise<void> {
    if (!this.validateVarCheck()) {
      this.addRequestStore.changeSavingRequestStatus(false);
      return;
    }

    if (!this.validationService.isValidAllSubIssueType(this.logInfoComponents)) {
      this.addRequestStore.changeSavingRequestStatus(false);
      return;
    }

    this.primitiveProps.isShowActualScore = true;
    if (this.filter.isVoided) {
      this.openConfirmWrongScore();
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

  private openConfirmWrongScore(): void {
    const selectedScores = this.getSelectedWrongScores(this.wrongScoreModels);
    this.confirmWrongScoreModel.warningExcludedScores = [];
    this.confirmWrongScoreModel.warningRelatedEvents = [];
    if (!this.filter.isVoided) {
      this.allRelatedEvents.forEach(x => {
        x.messageValidationLogInfo?.forEach(t => {
          if (t.reason.includes(LABELS.NO_VALID_TICKETS_IN_RANGE)) {
            this.confirmWrongScoreModel.warningRelatedEvents.push(x.eventName);
          }
        });
      });
      this.wrongScoreModels.forEach(y => {
        y.messageValidationLogInfo?.forEach(t => {
          if (t.reason.includes(LABELS.NO_VALID_TICKETS_IN_RANGE)) {
            this.confirmWrongScoreModel.warningExcludedScores.push(y.wrongScore);
          }
        });
      });
      this.confirmWrongScoreModel.isHasSettledTicket = this.validationService.isHasWarningSettledTicket(selectedScores);
      this.confirmWrongScoreModel.isHasWarningForWrongScore = this.validationService.isValidationHasWarningTicket(selectedScores);
      this.confirmWrongScoreModel.isHasWarningEditTakeNoteRequest = this.validationService.isHasWarningEditTakeNoteRequest(this.isEdit, this.filter.action, this.actionIdOfFirstTimeAccess);
    }

    this.confirmWrongScoreModel.isEditingByAnotherUser = this.validationService.isEditingByAnotherUser(this.isEdit, Number(document.getElementById('body').getAttribute('user-id')), this.userId);
    this.confirmWrongScoreModel.requestId = this.requestId;
    this.confirmWrongScoreModel.requestedBy = this.requestedBy;
    this.confirmWrongScoreModel.issueTypeName = this.issueTypes.issueTypes.find(x => x.issueTypeId.toString() === this.filter.issueTypeId).issueTypeName;
    this.confirmWrongScoreModel.subIssueTypeName = this.issueTypes.selectedSubIssueTypes.find(x => x.subIssueTypeId.toString() === this.filter.subIssueTypeId).subIssueTypeName;
    this.confirmWrongScoreModel.isOpenDialog = true;

    this.confirmWrongScoreModel = _.clone(this.confirmWrongScoreModel);
  }

  public getSelectedWrongScores(wrongScoreModels: WrongScoreModel[]): WrongScoreModel[] {
    return wrongScoreModels.filter(x => x.isChecked || x.isMainMatch);
  }

  /* istanbul ignore next */
  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }

  private async saveWhenRequestNotVoided(): Promise<void> {
    const validation = await this.saveRequestService.checkValidationBeforeSaveRequest(this.createValidationBusinessRuleArgs());
    if (validation.isValid) {
      this.openConfirmWrongScore();
    } else {
      this.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  private createSaveRequestArg(): SaveRequestArg {
    const args = new SaveRequestArg();
    args.requestId = this.requestId;
    args.isEdit = this.isEdit;
    args.isVoided = this.isVoided;
    args.filter = this.filter;
    args.others = this.others;
    args.issueTypes = this.issueTypes;
    args.primitiveProps = this.primitiveProps;
    args.wrongScoreModels = this.getSelectedWrongScores(this.wrongScoreModels);
    args.wrongScoreInfoComponents = this.wrongScoreService.getSelectedWrongScoreComponents(this.wrongScoreInfoComponents);
    args.leagueEventWrongScoreComponent = this.eventLeagueComponent;
    args.filterWrongScoreComponent = this.filterWrongScoreComponent;
    args.tvDetectionComponent = this.tvDetectionComponent;
    args.tvDetectionModel = this.tvDetectionModel;
    args.addRequestStore = this.addRequestStore;
    args.tooltip = this.tooltip;
    args.allSelectedEvents = this.allRelatedEvents;
    args.defaultFilterTimeWithAllowance = this.defaultFilterTimeWithAllowance;

    return args;
  }

  private createValidationBusinessRuleArgs(): ValidationBusinessRuleArgs {
    const args = new ValidationBusinessRuleArgs();
    args.requestId = this.requestId;
    args.isEdit = this.isEdit;
    args.filter = this.filter;
    args.primitiveProps = this.primitiveProps;
    args.wrongScoreModels = this.getSelectedWrongScores(this.wrongScoreModels);
    args.wrongScoreInfoComponents = this.wrongScoreService.getSelectedWrongScoreComponents(this.wrongScoreInfoComponents);
    args.leagueEventWrongScoreComponent = this.eventLeagueComponent;
    args.filterWrongScoreComponent = this.filterWrongScoreComponent;
    args.tvDetectionComponent = this.tvDetectionComponent;
    args.addRequestStore = this.addRequestStore;
    args.tooltip = this.tooltip;
    args.allSelectedEvents = this.allRelatedEvents;
    args.defaultFilterTimeWithAllowance = this.defaultFilterTimeWithAllowance;

    return args;
  }

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  getHighlightMinTimeClass(minTime?: Date): string {
    const highlightTimeClass = this.eventWrongScoreService.getHighlightMinTimeClass(this.wrongScoreModels[0]?.logInfoDetail?.highlightAcceptType, minTime);
    this.acceptTypeName = highlightTimeClass.acceptTypeName;
    return highlightTimeClass.highlightTimeClass;
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
    if (wrongScoreModels.filter(x => x.isChecked).length > 1 && this.primitiveProps.filterBy !== TVSRequestFilterBy.CHECK_TIME) {
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
    return this.wrongScoreService.getTimeSelectedScore(wrongScoreModels);
  }

  public getLogInfoDetail(): LogInfoDetail[] {
    return this.wrongScoreModels.filter(x => x.isChecked || !x.isMainMatch).map(x => x.logInfoDetail);
  }

  async handleClickAddRelatedEvent(): Promise<void> {
    await this.relatedEventService.addRelatedEventByInput(this.initAddRelatedEventArgs());
  }

  showAddChildMatchModal(matchType: number) {
    this.addChildMatchModel.selectedMatchIds = this.allRelatedEvents.map(x => x.matchId);
    this.addChildMatchModel.matchType = matchType;
    this.addChildMatchModel.isOpen = true;
    this.addChildMatchModel = _.clone(this.addChildMatchModel);
  }

  countChildMatches(): number {
    return this.relatedEvents.filter(x => x.matchType === MatchType.CHILD).length;
  }

  isDisabledChildMatches(): boolean {
    return this.filter.isVoided || this.relatedEvents.filter(x => x.matchType === MatchType.CHILD).length === 0;
  }

  countLinkMatches(): number {
    return this.relatedEvents.filter(x => x.matchType === MatchType.LINK).length;
  }

  isDisabledLinkMatches(): boolean {
    return this.filter.isVoided || this.relatedEvents.filter(x => x.matchType === MatchType.LINK).length === 0;
  }

  async saveRelatedEvent(selectedRelatedEvents: ChildMatchModel[]): Promise<void> {
    this.primitiveProps.isBlock = true;
    this.allRelatedEvents = this.eventWrongScoreService.updateCheckRelatedEvent(selectedRelatedEvents, this.allRelatedEvents, this.relatedEvents, this.addChildMatchModel.matchType);
    const newChildEvents = selectedRelatedEvents.filter(x => !this.allRelatedEvents.some(y => y.matchId === x.matchId));
    if (newChildEvents.length > 0) {
      await this.relatedEventService.addNewLogInfoRelatedEvent(newChildEvents, this.initAddRelatedEventArgs());
      this.allRelatedEvents = _.orderBy(_.uniqBy(this.allRelatedEvents, x => x.matchId), ['matchCode'], ['asc']);
    }

    this.primitiveProps.isBlock = false;
  }

  handleDeleteEvent(matchId: number): void {
    this.allRelatedEvents = this.allRelatedEvents.filter(x => x.matchId !== matchId);
  }
}