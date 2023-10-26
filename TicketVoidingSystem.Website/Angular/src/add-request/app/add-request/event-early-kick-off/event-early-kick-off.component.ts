import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { AddChildMatchModel } from '../../../../utility/components/add-child-match/add-child-match.model';
import { DateFullTimeNewComponent } from '../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { PagingConstant } from '../../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { MatchType } from '../../../../utility/constants/config';
import { MatchInfo } from '../../../../utility/models/event.model';
import { AddRequestStore } from '../add-request.store';
import { LeagueEventRedCardComponent } from '../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { EarlyKickOffModel } from '../models/event-eko.model';
import { ChildMatchModel } from '../models/related-event.model';
import { TransInfoAddRequestModel } from '../models/trans-info-add-request.model';
import { OthersModel } from '../others/others.model';
import { LogInfoEkoComponent } from './log-info-eko/log-info-eko.component';
import { AddRelatedEventArg } from './models/add-related-event.model';
import { LogInfoEarlyKickOff } from './models/log-info-eko.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventEarlyKickOffService } from './services/event-eko.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-early-kick-off',
  templateUrl: './event-early-kick-off.component.html',
  styleUrls: ['./event-early-kick-off.component.scss']
})
export class EventEarlyKickOffComponent implements OnInit {
  @Input() filter: FilterModel;
  @Input() isEdit: boolean;
  @Input() requestId: number;
  @Input() issueTypes = new IssueTypes();
  @Input() userId: number;
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() earlyKickOffModels: EarlyKickOffModel[] = [];
  @Input() requestedBy: string;
  @Input() others = new OthersModel();
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('leagueEvent') leagueEventComponent: LeagueEventRedCardComponent;
  @ViewChild('kickOffTime') kickOffTimeComponent: DateFullTimeNewComponent;
  @ViewChildren('logInfo') logInfoComponents: QueryList<LogInfoEkoComponent>;
  private readonly INPUT_MATCH_ID_CLASS = 'input-related-match-id';

  transInfoAddRequestModel: TransInfoAddRequestModel;
  mainEvent = new LogInfoEarlyKickOff();
  allSelectedEvents: LogInfoEarlyKickOff[] = [];
  relatedEvents: ChildMatchModel[] = [];
  addChildMatchModel = new AddChildMatchModel();
  primitiveProps = new PrimitiveProperty();
  tooltip = new Tooltip();
  constructor(
    private readonly element: ElementRef,
    private readonly addRequestStore: AddRequestStore,
    private readonly logInfoService: LogInfoService,
    private readonly saveRequestService: SaveRequestService,
    private readonly validationService: ValidationService,
    private readonly relatedEventService: RelatedEventService,
    private readonly eventEarlyKickOffService: EventEarlyKickOffService,
    ) {
      this.tooltip.element = this.element;
     }

  public async ngOnInit(): Promise<void> {
    if (this.isEdit) {
      this.eventEarlyKickOffService.assignModelsToEvents(this.allSelectedEvents, this.earlyKickOffModels, this.filter);
      this.mainEvent = this.allSelectedEvents.find(x => x.isMainMatch);
      this.addRequestStore.changeBlockingUiStatus(true);
      if (!this.filter.isVoided) {
        await this.getTicketsMainEvent();
      }
      this.relatedEvents = await this.relatedEventService.getChildMatches(this.mainEvent.matchId, this.filter, true);
      this.primitiveProps.isShowLogInfoEvents = true;
      this.addRequestStore.changeBlockingUiStatus(false);
    } else {
      this.resetAllData();
      this.mainEvent = this.eventEarlyKickOffService.initDefaultMainEvent(this.allSelectedEvents);
    }
  }

  public changeMatchEvent(): void {
    this.primitiveProps.isShowLogInfoEvents = false;
    this.allSelectedEvents = this.allSelectedEvents.filter(x => x.isMainMatch);
    this.logInfoService.resetLogInfoOfEvent(this.allSelectedEvents);

    console.log(this.mainEvent)
    this.mainEvent.leagueName = this.leagueEventComponent?.selectedMatch.leagueName;
    this.mainEvent.matchId = this.leagueEventComponent?.selectedMatch.matchId;
    this.mainEvent.eventName = this.leagueEventComponent?.selectedMatch.name;
    this.mainEvent.matchCode = this.leagueEventComponent?.selectedMatch.matchCode;
    this.mainEvent.kickOffTime = this.updateKickOffTime(this.leagueEventComponent?.selectedMatch);
    this.mainEvent.subIssueTypeId = Number(this.filter.subIssueTypeId);
    this.updateMatchId.emit(this.mainEvent.matchId);
  }

  public changeKickOffTime(): void {
    this.primitiveProps.isShowLogInfoEvents = false;
    if (this.kickOffTimeComponent.isTimeValid()) {
      this.allSelectedEvents.forEach(x => x.kickOffTime = this.kickOffTimeComponent.getDateTime());
    }
    this.logInfoService.resetLogInfoOfEvent(this.allSelectedEvents);
  }

  public async handleSearchEvent(): Promise<void> {
    this.logInfoService.resetLogInfoOfEvent(this.allSelectedEvents);
    this.allSelectedEvents.filter(x => !x.isMainMatch).forEach(x => {
      x.isCollapse = true;
    })

    if (!this.validationService.validateCommonData(this.leagueEventComponent, this.tooltip, this.kickOffTimeComponent)) {
      return;
    }

    this.primitiveProps.isShowLogInfoEvents = false;
    this.addRequestStore.changeBlockingUiStatus(true);

    this.relatedEvents = await this.relatedEventService.getChildMatches(this.mainEvent.matchId, this.filter, true);
    await this.relatedEventService.getDataWhenSearch(this.relatedEvents, this.initAddRelatedEventArgs());
    this.allSelectedEvents = _.orderBy(_.uniqBy(this.allSelectedEvents, x => x.matchId), ['matchCode'], ['asc']);
    await this.getTicketsMainEvent();
    this.primitiveProps.isShowLogInfoEvents = true;

    this.addRequestStore.changeBlockingUiStatus(false);
  }

  public async getTicketsMainEvent(): Promise<void> {
    const query = this.logInfoService.initQuery(PagingConstant.INDEX_ZERO, PagingConstant.SIZE_ONE, this.mainEvent, this.filter);
    await this.logInfoService.getTickets(query, this.mainEvent, this.isEdit, this.requestId, this.filter, this.primitiveProps);
  }

  public async handleClickAddRelatedEvent(): Promise<void> {
    await this.relatedEventService.addRelatedEventByInput(this.initAddRelatedEventArgs());
  }

  public async saveRequest(isSaveAndVoid: boolean): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    await this.saveRequestService.saveRequest(this.initSaveRequestInput(isSaveAndVoid));
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  private initSaveRequestInput(isSaveAndVoid: boolean) {
    const arg = new SaveRequestArg();
    arg.requestId = this.requestId;
    arg.requestedBy = this.requestedBy;
    arg.isEdit = this.isEdit;
    arg.userId = this.userId;
    arg.actionIdOfFirstTimeAccess = this.actionIdOfFirstTimeAccess;
    arg.others = this.others;
    arg.filter = this.filter;
    arg.primitiveProps = this.primitiveProps;
    arg.leagueEventComponent = this.leagueEventComponent;
    arg.allEvents = this.allSelectedEvents;
    arg.mainEvent = this.mainEvent;
    arg.addRequestStore = this.addRequestStore;
    arg.tooltip = this.tooltip;
    arg.kickOffTimeComponent = this.kickOffTimeComponent;
    arg.others = this.others;
    arg.isSaveAndVoid = isSaveAndVoid;

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
    arg.originalRelatedEvents = this.relatedEvents;

    return arg;
  }

  public showAddChildMatchModal(matchTypeId: number) {
    this.addChildMatchModel.selectedMatchIds = this.allSelectedEvents.map(x => x.matchId);
    this.addChildMatchModel.matchType = matchTypeId;
    this.addChildMatchModel.isOpen = true;
    this.addChildMatchModel = _.clone(this.addChildMatchModel);
  }

  public async saveRelatedEvent(selectedEvents: ChildMatchModel[]): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.allSelectedEvents = this.allSelectedEvents.filter(x =>
      (selectedEvents.some(y => y.matchId === x.matchId)
      || this.relatedEvents.find(y => y.matchId === x.matchId)?.matchType !== this.addChildMatchModel.matchType)
      || x.isMainMatch);
    const newChildEvents = selectedEvents.filter(x => !this.allSelectedEvents.some(y => y.matchId === x.matchId));
    const newEvents = this.relatedEventService.updateEvents(newChildEvents, this.mainEvent);
    if (newEvents.length > 0) {
      await this.logInfoService.getLogInfo(newEvents, this.isEdit, this.requestId, this.filter, this.primitiveProps);
      this.allSelectedEvents.push(...newEvents);
      this.allSelectedEvents = _.orderBy(_.uniqBy(this.allSelectedEvents, x => x.matchId), ['matchCode'], ['asc']);
    }
    this.addRequestStore.changeBlockingUiStatus(false);

  }

  public handleDeleteEvent(matchId: number): void {
    this.allSelectedEvents = this.allSelectedEvents.filter(x => x.matchId !== matchId || x.isMainMatch);
  }

  public isDisabledChildMatches(): boolean {
    return this.filter.isVoided || this.relatedEvents.filter(x => x.matchType === MatchType.CHILD).length === 0;
  }

  public isDisabledLinkMatches(): boolean {
    return this.filter.isVoided || this.relatedEvents.filter(x => x.matchType === MatchType.LINK).length === 0;
  }

  public countLinkMatches(): number {
    return this.relatedEvents.filter(x => x.matchType === MatchType.LINK).length;
  }

  public resetAllData(): void {
    this.primitiveProps.isShowLogInfoEvents = false;
    this.allSelectedEvents = [];
  }

  public countChildMatches(): number {
    return this.relatedEvents.filter(x => x.matchType === MatchType.CHILD).length;
  }

  private updateKickOffTime(matchInfo: MatchInfo): string {
    if (matchInfo?.matchId && !this.isEdit) {
      return moment(matchInfo.kickOffTime).format('YYYY-MM-DD HH:mm:ss.SSS');
    }

    return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
  }
}
