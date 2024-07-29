import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import { AddChildMatchModel } from '../../../../utility/components/add-child-match/add-child-match.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { MatchType, PoolHouseTicketValue } from '../../../../utility/constants/config';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongOuModel } from '../models/event-wrong-ou.model';
import { ChildMatchModel } from '../models/related-event.model';
import { OthersModel } from '../others/others.model';
import { LogInfoWrongOuComponent } from './log-info-wrong-ou/log-info-wrong-ou.component';
import { AddRelatedEventArg } from './models/add-related-event-arg.model';
import { LogInfoWrongOu } from './models/log-info-wrong-ou.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventWrongOuService } from './services/event-wrong-ou.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-wrong-ou',
  templateUrl: './event-wrong-ou.component.html',
  styleUrls: ['./event-wrong-ou.component.scss']
})
export class EventWrongOuComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() issueTypeId: string;
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() wrongOuModels: WrongOuModel[] = [];
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('leagueEvent') eventLeagueComponent: EventLeagueComponent;
  @ViewChildren('logInfo') logInfoComponents: QueryList<LogInfoWrongOuComponent>;

  mainEvent = new LogInfoWrongOu();
  allSelectedEvents: LogInfoWrongOu[] = [];
  relatedEvents: ChildMatchModel[] = [];
  addChildMatchModel = new AddChildMatchModel();
  primitiveProps = new PrimitiveProperty();
  tooltip = new Tooltip();
  private readonly INPUT_MATCH_ID_CLASS = 'input-related-match-id';

  constructor(
    private readonly element: ElementRef,
    private readonly logInfoWrongOuService: LogInfoService,
    private readonly eventWrongOuService: EventWrongOuService,
    private readonly addRequestStore: AddRequestStore,
    private readonly validationService: ValidationService,
    private readonly relatedEventService: RelatedEventService,
    private readonly saveRequestService: SaveRequestService
  ) {
      this.tooltip.element = this.element;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['issueTypeId'] && !this.isEdit) {
      this.allSelectedEvents = this.allSelectedEvents.filter(x => x.isMainMatch);
      this.eventWrongOuService.initDefaultFilter(this.mainEvent);
      this.resetLogInfoAndHideEvents();
    }
    if (changes['filter'] && this.filter.isChangeSubTypeManual) {
      this.resetLogInfoAndHideEvents();
      this.filter.isChangeSubTypeManual = false;
    }
  }

  public async ngOnInit(): Promise<void> {
    if (this.isEdit) {
      this.eventWrongOuService.assignModelsToEvents(this.allSelectedEvents, this.wrongOuModels);
      this.mainEvent = this.allSelectedEvents.find(x => x.isMainMatch);
      this.relatedEvents = await this.relatedEventService.getChildMatches(this.mainEvent.matchId, this.filter, true);
      this.primitiveProps.isShowRelatedEvents = true;
    } else {
      this.resetAllData();
      this.mainEvent = this.eventWrongOuService.initDefaultMainEvent(this.allSelectedEvents);
    }
  }

  public async handleSearchEvent(): Promise<void> {
    this.mainEvent.poolHouseCheckedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
    this.logInfoWrongOuService.resetLogInfoOfEvent([this.mainEvent]);
    const mainLogInfo = this.logInfoComponents.find(x => x.isMainMatch);

    if (!this.validationService.validateCommonData(this.eventLeagueComponent, [mainLogInfo])) {
      return;
    }

    mainLogInfo.isBlock = true;
    this.mainEvent.linkedLogsViewModel = await this.eventWrongOuService.getLinkedLog(this.mainEvent, this.filter);
    await this.logInfoWrongOuService.getLogInfo([this.mainEvent], this.isEdit, this.requestId, this.filter, this.primitiveProps);
    mainLogInfo.logInfo.isShowValidation = true;

    this.relatedEvents = await this.relatedEventService.getChildMatches(this.mainEvent.matchId, this.filter, true);
    this.primitiveProps.isShowRelatedEvents = true;
    this.addRequestStore.changeSavingRequestStatus(false);
    mainLogInfo.isBlock = false;
  }

  public changeMatchEvent(): void {
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    this.primitiveProps.isShowRelatedEvents = false;
    this.allSelectedEvents = this.allSelectedEvents.filter(x => x.isMainMatch);
    this.logInfoWrongOuService.resetLogInfoOfEvent(this.allSelectedEvents);
    this.mainEvent.leagueName = this.eventLeagueComponent?.selectedMatch.leagueName;
    this.mainEvent.matchId = this.eventLeagueComponent?.selectedMatch.matchId;
    this.mainEvent.eventName = this.eventLeagueComponent?.selectedMatch.name;
    this.mainEvent.matchCode = this.eventLeagueComponent?.selectedMatch.matchCode;
    this.updateMatchId.emit(this.mainEvent.matchId);
  }

  public showAddChildMatchModal(matchTypeId: number) {
    this.addChildMatchModel.selectedMatchIds = this.allSelectedEvents.map(x => x.matchId);
    this.addChildMatchModel.matchType = matchTypeId;
    this.addChildMatchModel.isOpen = true;
    this.addChildMatchModel = _.clone(this.addChildMatchModel);
  }

  public async saveRelatedEvent(selectedEvents: ChildMatchModel[]): Promise<void> {
    this.primitiveProps.isBlock = true;
    this.allSelectedEvents = this.allSelectedEvents.filter(x =>
      (selectedEvents.some(y => y.matchId === x.matchId)
      || this.relatedEvents.find(y => y.matchId === x.matchId)?.matchType !== this.addChildMatchModel.matchType)
      || x.isMainMatch);
    const newChildEvents = selectedEvents.filter(x => !this.allSelectedEvents.some(y => y.matchId === x.matchId));
    const newEvents = this.relatedEventService.updateEvents(newChildEvents, this.mainEvent.filterWrongOu);
    this.allSelectedEvents.push(...newEvents);
    this.allSelectedEvents = _.orderBy(_.uniqBy(this.allSelectedEvents, x => x.matchId), ['matchCode'], ['asc']);
    this.primitiveProps.isShowRelatedEvents = true;
    this.primitiveProps.isBlock = false;
  }

  public handleDeleteEvent(matchId: number): void {
    this.allSelectedEvents = this.allSelectedEvents.filter(x => x.matchId !== matchId || x.isMainMatch);
  }

  public async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.logInfoComponents.forEach(x => x.logInfo.isShowValidation = false);
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  public async handleClickAddRelatedEvent(): Promise<void> {
    await this.relatedEventService.addRelatedEventByInput(this.initAddRelatedEventArgs());
  }

  private resetLogInfoAndHideEvents() {
    this.primitiveProps.isShowRelatedEvents = false;
    this.logInfoWrongOuService.resetLogInfoOfEvent(this.allSelectedEvents);
  }

  private initSaveRequestInput() {
    const arg = new SaveRequestArg();
    arg.requestId = this.requestId;
    arg.requestedBy = this.requestedBy;
    arg.isEdit = this.isEdit;
    arg.userId = this.userId;
    arg.actionIdOfFirstTimeAccess = this.actionIdOfFirstTimeAccess;
    arg.others = this.others;
    arg.filter = this.filter;
    arg.primitiveProps = this.primitiveProps;
    arg.eventLeagueComponent = this.eventLeagueComponent;
    arg.logInfoComponents = this.logInfoComponents.toArray();
    arg.allEvents = this.allSelectedEvents;
    arg.mainEvent = this.mainEvent;
    arg.addRequestStore = this.addRequestStore;

    return arg;
  }

  private initAddRelatedEventArgs() {
    const arg = new AddRelatedEventArg();
    arg.requestId = this.requestId;
    arg.tooltip = this.tooltip;
    arg.isEdit = this.isEdit;
    arg.filter = this.filter;
    arg.allEvents = this.allSelectedEvents;
    arg.primitiveProps = this.primitiveProps;
    arg.mainEvent = this.mainEvent;
    arg.addRequestStore = this.addRequestStore;
    arg.inputMatchIdClass = this.INPUT_MATCH_ID_CLASS;
    arg.defaultFilterWrongOuModel = this.mainEvent.filterWrongOu;
    arg.originalRelatedEvents = this.relatedEvents;

    return arg;
  }

  public countLinkMatches(): number {
    return this.relatedEvents.filter(x => x.matchType === MatchType.LINK).length;
  }

  public resetAllData(): void {
    this.primitiveProps.isShowRelatedEvents = false;
    this.allSelectedEvents = [];
  }

  public countChildMatches(): number {
    return this.relatedEvents.filter(x => x.matchType === MatchType.CHILD).length;
  }

  public isDisabledChildMatches(): boolean {
    return this.filter.isVoided || this.relatedEvents.filter(x => x.matchType === MatchType.CHILD).length === 0;
  }

  public isDisabledLinkMatches(): boolean {
    return this.filter.isVoided || this.relatedEvents.filter(x => x.matchType === MatchType.LINK).length === 0;
  }
}
