import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { Subscription } from 'rxjs';
import { AddChildMatchModel } from '../../../../utility/components/add-child-match/add-child-match.model';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, MatchType, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { AddRequestStore } from '../add-request.store';
import { TvDetectionComponent } from '../components/tv-detection/tv-detection.component';
import { ConfirmAddRequestModel } from '../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { RedCardModel } from '../models/event-red-card.model';
import { GetChildMatchQuery } from '../models/get-child-match.query';
import { ChildMatchModel } from '../models/related-event.model';
import { OthersModel } from '../others/others.model';
import { EventLeagueComponent } from './../../../../utility/components/event-league/event-league.component';
import { LABELS } from './../../../../utility/constants/labels';
import { StaticService } from './../../../../utility/services/static.service';
import { PrimitiveProperty } from './event-red-card.model';
import { FilterTimeAreaComponent } from './filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowance } from './filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRedCardComponent } from './log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from './log-info-red-card/log-info-red-card.model';
import { EventRedCardService } from './services/event-red-card.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestArg } from './services/save-request.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-red-card',
  templateUrl: './event-red-card.component.html',
  styleUrls: ['./event-red-card.component.scss']
})
export class EventRedCardComponent implements OnInit, OnChanges {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() issueTypes = new IssueTypes();
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() redCardModels: RedCardModel[] = [];
  @Output() redCardModelsChange = new EventEmitter<RedCardModel[]>();
  @Output() updateMatchId = new EventEmitter<MatchModel>();
  @ViewChild('tvDetection') tvDetectionComponent: TvDetectionComponent;
  @ViewChild('filterTimeArea') filterTimeAreaComponent: FilterTimeAreaComponent;
  @ViewChild('leagueEvent') eventLeagueComponent: EventLeagueComponent;
  @ViewChildren('logInfo') logInfoComponents: QueryList<LogInfoRedCardComponent>;

  tooltip = new Tooltip();
  primitiveProps = new PrimitiveProperty();
  defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
  confirmRedCard = new ConfirmAddRequestModel();
  mainEvent = new LogInfoRedCard();
  allSelectedEvents: LogInfoRedCard[] = [];
  relatedEvents: ChildMatchModel[] = [];
  addChildMatchModel = new AddChildMatchModel();
  tooltipVarMessage = LABELS.SELECTED_VAR_OPTIONS;
  getAllowanceTimeSubscription: Subscription;

  private readonly INPUT_MATCH_ID_CLASS = 'input-related-match-id';

  constructor(
    private readonly element: ElementRef,
    private readonly logInfoService: LogInfoService,
    private readonly validationService: ValidationService,
    private readonly saveRequestService: SaveRequestService,
    private readonly addRequestStore: AddRequestStore,
    private readonly relatedEventService: RelatedEventService,
    private readonly eventRedCardService: EventRedCardService,
  ) {
    this.tooltip.element = this.element;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filter'] && this.filter.isChangeSubTypeManual) {
      this.mainEvent.subIssueTypeId = Number(this.filter.subIssueTypeId);
      this.resetLogInfoAndHideAllEvents();
      this.logInfoService.resetVoidTimeArea(this.allSelectedEvents, this.defaultFilterTimeWithAllowance);
      this.logInfoService.resetIsCheckedVar(this.allSelectedEvents);
      this.filter.isChangeSubTypeManual = false;
    }
  }

  async ngOnInit(): Promise<void> {
    this.getAllowanceTimeSubscription = this.addRequestStore.getAllowanceTimeSubject.subscribe(model => {
      this.defaultFilterTimeWithAllowance.aaTime = model.aaTime;
      this.defaultFilterTimeWithAllowance.paTime = model.paTime;
      this.defaultFilterTimeWithAllowance.saTime = model.saTime;
    });
    if (this.isEdit) {
      this.eventRedCardService.assignModelsToEvents(this.allSelectedEvents, this.redCardModels, this.primitiveProps, this.addRequestStore);
      this.mainEvent = this.allSelectedEvents.find(x => x.isMainMatch);
      this.eventRedCardService.updateDefaultFilterTime(this.defaultFilterTimeWithAllowance, this.redCardModels);
      this.relatedEvents = await this.relatedEventService.getChildMatches(this.createGetChildMatchesQuery());
      this.primitiveProps.isShowLogInfoMainMatch = true;
      this.primitiveProps.isShowRelatedEvents = true;
    } else {
      this.mainEvent = this.eventRedCardService.initDefaultMainEvent(this.allSelectedEvents);
      this.eventRedCardService.initDefaultFilterTime(this.defaultFilterTimeWithAllowance);
      this.primitiveProps.filterBy = TVSRequestFilterBy.CHECK_TIME;
    }
  }

  ngOnDestroy(): void {
    this.getAllowanceTimeSubscription?.unsubscribe();
  }

  private createGetChildMatchesQuery(): GetChildMatchQuery{
    const query = new GetChildMatchQuery();
    query.issueTypeId = Number(this.filter.issueTypeId);
    query.eventDate = this.mainEvent.eventDate ? moment(this.mainEvent.eventDate).format(DateTimeFormat.SHORT_DATE_FORMAT) : null;
    query.matchId = this.mainEvent.matchId;
    query.isMainMatch = true;
    query.sportType = this.mainEvent.sportType;

    return query;
  }

  async handleSearchEvent(): Promise<void> {
    this.primitiveProps.isShowLogInfoMainMatch = false;

    if (!this.validationService.validateCommonData(this.filter, this.eventLeagueComponent, this.filterTimeAreaComponent,
      this.logInfoComponents, this.addRequestStore, this.tvDetectionComponent)) {
      return;
    }
    if (this.mainEvent.isCheckedVar == null && this.isShowVarCheck()) {
      this.mainEvent.isHighLightVarCheck = true;
      return;
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    this.relatedEvents = await this.relatedEventService.getChildMatches(this.createGetChildMatchesQuery());
    await this.relatedEventService.getDataWhenSearch(this.relatedEvents, this.initAddRelatedEventArgs());
    this.allSelectedEvents = _.orderBy(_.uniqBy(this.allSelectedEvents, x => x.matchId), ['matchCode'], ['asc']);
    this.logInfoComponents.forEach(x => {
      x.filterTimeWithAllowanceComponent?.updateData();
      x.showValidationDetail();
    });
    this.logInfoService.updateIsCheckedVar(this.allSelectedEvents, this.mainEvent.isCheckedVar);
    this.primitiveProps.isShowLogInfoMainMatch = true;
    this.primitiveProps.isShowRelatedEvents = true;
    this.addRequestStore.changeSavingRequestStatus(false);
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  changeMatchEvent(): void {
    this.primitiveProps.isShowLogInfoMainMatch = false;
    this.primitiveProps.isShowRelatedEvents = false;
    this.allSelectedEvents = this.allSelectedEvents.filter(x => x.isMainMatch);
    this.logInfoService.resetLogInfoOfEvent(this.allSelectedEvents);
    this.mainEvent.matchId = this.eventLeagueComponent?.selectedMatch.matchId;
    this.mainEvent.eventName = this.eventLeagueComponent?.selectedMatch.name;
    this.mainEvent.leagueName = this.eventLeagueComponent?.selectedMatch.leagueName;
    this.mainEvent.matchCode = this.eventLeagueComponent?.selectedMatch.matchCode;
    this.mainEvent.eventDate = this.eventLeagueComponent?.selectedMatch.eventDate;
    this.mainEvent.sportType = this.eventLeagueComponent?.selectedMatch.sportType;
    this.updateMatchId.emit(this.eventLeagueComponent?.selectedMatch);
  }

  isExistMatchEvent(): boolean {
    return (this.mainEvent.matchId) ? true : false;
  }

  resetLogInfoAndHideAllEvents() {
    this.primitiveProps.isShowLogInfoMainMatch = false;
    this.primitiveProps.isShowRelatedEvents = false;
    this.logInfoService.resetLogInfoOfEvent(this.allSelectedEvents);
  }

  async saveRequest(): Promise<void> {
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
  }

  async onClickConfirmSaveRequest() {
    await this.saveRequestService.onClickConfirmSave(this.initSaveRequestInput());
  }

  onClickCancel() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  async saveRelatedEvent(selectedRelatedEvents: ChildMatchModel[]): Promise<void> {
    this.primitiveProps.isBlock = true;
    this.allSelectedEvents = this.allSelectedEvents.filter(x =>
      (selectedRelatedEvents.some(y => y.matchId === x.matchId)
        || this.relatedEvents.find(y => y.matchId === x.matchId)?.matchType !== this.addChildMatchModel.matchType)
      || x.isMainMatch);
    const newChildEvents = selectedRelatedEvents.filter(x => !this.allSelectedEvents.some(y => y.matchId === x.matchId));
    if (newChildEvents.length > 0) {
      const newEvents = this.relatedEventService.assignChildMatchToLogInfoModel(newChildEvents, this.defaultFilterTimeWithAllowance, this.mainEvent.subIssueTypeId);
      await this.eventRedCardService.updateSubIssueTypeAndAllowanceTime(newEvents, this.mainEvent, this.relatedEvents, this.defaultFilterTimeWithAllowance);
      await this.logInfoService.getLogInfo(newEvents, this.primitiveProps, this.isEdit, this.requestId, this.filter, this.defaultFilterTimeWithAllowance);
      this.logInfoService.updateIsCheckedVar(newEvents, this.mainEvent.isCheckedVar);
      this.allSelectedEvents.push(...newEvents);
      this.allSelectedEvents = _.orderBy(_.uniqBy(this.allSelectedEvents, x => x.matchId), ['matchCode'], ['asc']);
    }
    this.primitiveProps.isShowRelatedEvents = true;
    this.primitiveProps.isBlock = false;
  }

  async handleClickAddRelatedEvent(): Promise<void> {
    await this.relatedEventService.addRelatedEventByInput(this.initAddRelatedEventArgs());
    this.allSelectedEvents = _.orderBy(_.uniqBy(this.allSelectedEvents, x => x.matchId), ['matchCode'], ['asc']);
  }

  handleDeleteEvent(matchId: number): void {
    this.allSelectedEvents = this.allSelectedEvents.filter(x => x.matchId !== matchId || x.isMainMatch);
  }

  showAddChildMatchModal(matchType: number) {
    this.addChildMatchModel.selectedMatchIds = this.allSelectedEvents.map(x => x.matchId);
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

  actualTimeChange(actualTime: string) {
    this.filterTimeAreaComponent.filterTimeWithAllowanceComponent.fromTime = moment(actualTime, DateTimeFormat.SIMPLE_TIME_FORMAT)
      .format(DateTimeFormat.TIME_FORMAT);
    this.resetLogInfoAndHideAllEvents();
  }

  private initSaveRequestInput() {
    const arg = new SaveRequestArg();
    arg.requestId = this.requestId;
    arg.isEdit = this.isEdit;
    arg.userId = this.userId;
    arg.requestedBy = this.requestedBy;
    arg.actionIdOfFirstTimeAccess = this.actionIdOfFirstTimeAccess;
    arg.filter = this.filter;
    arg.others = this.others;
    arg.primitiveProps = this.primitiveProps;
    arg.defaultFilterTimeWithAllowance = this.defaultFilterTimeWithAllowance;
    arg.allEvents = this.allSelectedEvents;
    arg.eventLeagueComponent = this.eventLeagueComponent;
    arg.tvDetectionComponent = this.tvDetectionComponent;
    arg.filterTimeAreaComponent = this.filterTimeAreaComponent;
    arg.logInfoComponents = this.logInfoComponents;
    arg.confirmRedCard = this.confirmRedCard;
    arg.addRequestStore = this.addRequestStore;

    return arg;
  }

  private initAddRelatedEventArgs() {
    const arg = new AddRelatedEventArg();
    arg.tooltip = this.tooltip;
    arg.requestId = this.requestId;
    arg.isEdit = this.isEdit;
    arg.filter = this.filter;
    arg.primitiveProps = this.primitiveProps;
    arg.defaultFilterTimeWithAllowance = this.defaultFilterTimeWithAllowance;
    arg.allEvents = this.allSelectedEvents;
    arg.mainEvent = this.mainEvent;
    arg.addRequestStore = this.addRequestStore;
    arg.inputMatchIdClass = this.INPUT_MATCH_ID_CLASS;
    arg.originalRelatedEvents = this.relatedEvents;

    return arg;
  }

  isShowVarCheck(): boolean {
    return StaticService.isShowVarCheck(this.mainEvent.subIssueTypeId);
  }

  changeVarCheckValue(isVarChecked: boolean): void {
    this.mainEvent.isCheckedVar = isVarChecked;
    this.mainEvent.isHighLightVarCheck = false;
  }

  public getLogInfoDetail(): LogInfoDetail[] {
    return [this.mainEvent.logInfoDetail];
  }
}
