import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { Subscription } from 'rxjs';
import { BlockUiDirective } from '../../../../utility/components/block-ui/block-ui.directive';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { TooltipComponent } from '../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { LABELS } from '../../../../utility/constants/labels';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { StaticService } from '../../../../utility/services/static.service';
import { AddRequestStore } from '../add-request.store';
import { LogInfoRelatedEvent } from '../components/log-info-related-event/log-info-related-event.model';
import { TvDetectionComponent } from '../components/tv-detection/tv-detection.component';
import { TvDetectionModel } from '../components/tv-detection/tv-detection.model';
import { TvDetectionService } from '../components/tv-detection/tv-detection.service';
import { FilterTimeWithAllowance } from '../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { WrongScoreModel } from '../models/event-wrong-score.model';
import { OthersModel } from '../others/others.model';
import { ConfirmWrongScoreComponent } from './confirm-wrong-score/confirm-wrong-score.component';
import { ConfirmWrongScoreModel } from './confirm-wrong-score/confirm-wrong-score.model';
import { PrimitiveProperty } from './event-wrong-score.model';
import { FilterWrongScoreComponent } from './filter-wrong-score/filter-wrong-score.component';
import { EditRequestService } from './services/edit-request.service';
import { EventWrongScoreService } from './services/event-wrong-score.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestArg } from './models/save-request.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationBusinessRuleArgs } from './models/validation.model';
import { ValidationService } from './services/validation.service';
import { WrongScoreService } from './services/wrong-score.service';
import { WrongScoreInfoComponent } from './wrong-score-info/wrong-score-info.component';
import { MainLogInfoComponent } from './main-log-info/main-log-info.component';
import { SubIssueTypeRelatedEvent } from './models/subIssue-type-related-event.model';
import { CreateMapService } from './services/create-map.service';
import { UpdateConfirmInfoArgs } from './models/confirm-wrong-score.model';
import { RelatedEventsComponent } from './related-events/related-events.component';
import { InfoSiteDBDownComponent } from '../components/info-site-db-down/info-site-db-down.component';

@Component({
  standalone: true,
  selector: 'event-wrong-score',
  templateUrl: './event-wrong-score.component.html',
  styleUrls: ['./event-wrong-score.component.scss'],
  imports: [EventLeagueComponent, TvDetectionComponent, FilterWrongScoreComponent, WrongScoreInfoComponent, ConfirmWrongScoreComponent, 
    CommonModule, FormsModule, TooltipComponent, BlockUiDirective, MainLogInfoComponent, RelatedEventsComponent, InfoSiteDBDownComponent],
  providers: [CreateMapService,  EventWrongScoreService, LogInfoService, SaveRequestService, ValidationService, WrongScoreService,
    RelatedEventService, EditRequestService, TvDetectionService]
})
export class EventWrongScoreComponent implements OnInit, OnChanges, AfterViewInit {
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
  @ViewChild('relatedEvent') relatedEventsComponent: RelatedEventsComponent;

  private readonly errorTooltipClassName = 'var-check-selection';

  primitiveProps = new PrimitiveProperty();
  tooltip = new Tooltip();
  originWrongScoreModels: WrongScoreModel[] = [];
  confirmWrongScoreModel = new ConfirmWrongScoreModel();
  tvDetectionModel = new TvDetectionModel();
  getAllowanceTimeSubscription: Subscription;
  acceptTypeName = "";
  relatedEvents: LogInfoRelatedEvent[] = [];
  defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
  mainEvent = new LogInfoRelatedEvent();
  filterBy = TVSRequestFilterBy.CHECK_TIME;

  private readonly element = inject(ElementRef);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly validationService = inject(ValidationService);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly wrongScoreService = inject(WrongScoreService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly editRequestService = inject(EditRequestService);
  private readonly eventWrongScoreService = inject(EventWrongScoreService);
  private readonly createMapService = inject(CreateMapService);
  
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
      const mainWrongScoreModel = this.editRequestService.getMainWrongScoreModel(this.wrongScoreModels);
      this.matchId = mainWrongScoreModel.matchId;
      this.editRequestService.assignPrimitivePropsEditRequest(mainWrongScoreModel, this.primitiveProps);
      if (this.primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME) {
        this.mainEvent = this.createMapService.assignMainEvent(mainWrongScoreModel);
        this.tvDetectionModel = this.eventWrongScoreService.getTvDetectionModel(mainWrongScoreModel);
      }
      else {
        this.originWrongScoreModels = await this.editRequestService.getScoreWrongScoreModels(this.wrongScoreModels, this.matchId);
        this.wrongScoreModels = _.orderBy(_.uniqBy(this.wrongScoreModels, x => x.scoreId), ['scoreId'], ['asc']);
      }
      this.defaultFilterTimeWithAllowance = this.wrongScoreService.getFilterWrongScore(mainWrongScoreModel);
    } else {
      this.defaultFilterTimeWithAllowance = this.wrongScoreService.initDefaultFilterWrongScore();
      this.addRequestStore.changeSavingRequestStatus(true);
    }
  }

  public async ngAfterViewInit(): Promise<void> {
    if (this.primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME) {
      this.mainEvent.isMainMatch = true;
      if (this.isEdit) {
        this.relatedEvents = await this.editRequestService.getAllRelatedEvents(this.wrongScoreModels, this.mainEvent, this.relatedEventsComponent.childEvents);
      }
    }
  }

  public async handleSearchEvent(): Promise<void> {
    if (!this.validationService.isValidAllSubIssueType(this.relatedEventsComponent.logInfoComponents)) {
      return;
    }

    this.logInfoService.clearDataValidation(this.wrongScoreModels, this.relatedEvents, this.mainEvent);

    if (!this.validationService.validateCommonData(this.filter, this.eventLeagueComponent, this.addRequestStore, this.filterWrongScoreComponent,
      this.wrongScoreService.getSelectedWrongScoreComponents(this.wrongScoreInfoComponents), this.tvDetectionComponent)) {
      return;
    }

    this.primitiveProps.isBlock = true;
    if (this.primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME) {
      this.mainEvent.subIssueTypeId = Number(this.filter.subIssueTypeId);
      this.mainEvent.isMainMatch = true;
      this.mainEvent.parentId = this.eventLeagueComponent.selectedMatch.parentId;
      await this.relatedEventsComponent.getDataWhenSearch();
    }
    else {
      this.originWrongScoreModels = await this.eventWrongScoreService.getAllWrongScoreModels(this.wrongScoreModels, this.matchId);
    }
    this.primitiveProps.isShowRelatedEvents = SubIssueTypeRelatedEvent.isHasRelatedEvent(Number(this.filter.subIssueTypeId));
    this.primitiveProps.isBlock = false;
    this.primitiveProps.isShowActualScore = true;
    this.updateStatusButtonSaveRequest();
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
    this.mainEvent.logInfoDetail = null;
    this.mainEvent.messageValidationLogInfo = [];
    this.wrongScoreModels = [];
    this.primitiveProps.isShowActualScore = false;
    this.primitiveProps.actualScore = '';
    this.relatedEventsComponent.resetData();
    this.clearInfoSiteDBDownModel();
  }

  public triggerCloseEvent() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public async saveRequest(): Promise<void> {
    this.relatedEvents = this.relatedEventsComponent.relatedEvents;
    if (!this.validateVarCheck()) {
      this.addRequestStore.changeSavingRequestStatus(false);
      return;
    }

    if (!this.validationService.isValidAllSubIssueType(this.relatedEventsComponent.logInfoComponents)) {
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

  private openConfirmWrongScore(): void {
    const updateInfoArgs: UpdateConfirmInfoArgs = {
      isEdit: this.isEdit,
      userId: this.userId,
      requestId: this.requestId,
      requestedBy: this.requestedBy,
      issueTypes: this.issueTypes,
      filter: this.filter,
      actionIdOfFirstTimeAccess: this.actionIdOfFirstTimeAccess,
      relatedEvents: this.relatedEvents,
      mainEvent: this.mainEvent,
      wrongScoreModels: this.wrongScoreModels,
      infoSiteDBDownModel: this.primitiveProps.infoSiteDBDownModel
    };
    
    this.eventWrongScoreService.updateInfoConfirm(this.confirmWrongScoreModel, updateInfoArgs);
    this.confirmWrongScoreModel = _.clone(this.confirmWrongScoreModel);
  }

  public getSelectedWrongScores(wrongScoreModels: WrongScoreModel[]): WrongScoreModel[] {
    return wrongScoreModels.filter(x => x.isChecked);
  }

  private async saveWhenRequestNotVoided(): Promise<void> {
    const validation = await this.saveRequestService.checkValidationBeforeSaveRequest(this.createValidationBusinessRuleArgs());
    if (validation.isValid) {
      this.relatedEvents = this.relatedEvents.map(event => _.cloneDeep(event));
      this.openConfirmWrongScore();
    } else {
      this.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  private createSaveRequestArg(): SaveRequestArg {
    const args = new SaveRequestArg();
    this.mapValidationBusinessData(args);
    args.others = this.others;
    args.issueTypes = this.issueTypes;
    args.tvDetectionModel = this.tvDetectionModel;
    args.isVoided = this.isVoided;
    args.isMarkTicketSiteDbDown = this.confirmWrongScoreModel.isMarkTicketSiteDbDown;
    
    return args;
  }

  private createValidationBusinessRuleArgs(): ValidationBusinessRuleArgs {
    const args = new ValidationBusinessRuleArgs();
    this.mapValidationBusinessData(args);

    return args;
  }

  private mapValidationBusinessData(args: ValidationBusinessRuleArgs | SaveRequestArg){
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
    args.relatedEvents = this.relatedEvents;
    args.defaultFilterTimeWithAllowance = this.defaultFilterTimeWithAllowance;
    args.mainEvent = this.mainEvent;
  }

  public updateStatusButtonSaveRequest(): void {
    const inValidSave = this.wrongScoreModels.every(x => !x.isChecked) && this.mainEvent?.logInfoDetail?.matchId === 0;
    this.addRequestStore.changeSavingRequestStatus(inValidSave);
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
    const checkedScoresCount = wrongScoreModels.filter(x => x.isChecked).length;
    const isNotCheckTimeFilter = this.primitiveProps.filterBy !== TVSRequestFilterBy.CHECK_TIME;

    return checkedScoresCount > 1 && isNotCheckTimeFilter;
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

  clearInfoSiteDBDownModel(): void {
    this.primitiveProps.infoSiteDBDownModel = null;
  }
}