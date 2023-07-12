import { LABELS } from './../../../../utility/constants/labels';
import { StaticService } from './../../../../utility/services/static.service';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import * as moment from 'moment-timezone';
import { Subscription } from 'rxjs';
import { DateTimeFormat, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { MatchInfo } from '../../../../utility/models/event.model';
import { Tooltip } from '../../../../utility/modules/tooltip/tooltip.model';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { RedCardModel } from '../models/event-red-card.model';
import { OthersModel } from '../others/others.model';
import { ConfirmRedCardModel } from './confirm-red-card/confirm-red-card.model';
import { PrimitiveProperty } from './event-red-card.model';
import { FilterTimeAreaComponent } from './filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowance } from './filter-time-with-allowance/filter-time-with-allowance.model';
import { LeagueEventRedCardComponent } from './league-event-red-card/league-event-red-card.component';
import { LogInfoRedCardComponent } from './log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from './log-info-red-card/log-info-red-card.model';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestArg } from './services/save-request.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation-service';

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
  @Output() updateMatchId = new EventEmitter<MatchInfo>();

  @ViewChild('filterTimeArea') filterTimeAreaComponent: FilterTimeAreaComponent;
  @ViewChild('leagueEvent') leagueEventRedCardComponent: LeagueEventRedCardComponent;
  @ViewChildren('logInfo') logInfoComponents: QueryList<LogInfoRedCardComponent>;

  tooltip = new Tooltip();
  primitiveProps = new PrimitiveProperty();
  defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
  confirmRedCard = new ConfirmRedCardModel();
  mainEvent = new LogInfoRedCard();
  tooltipVarMessage = LABELS.SELECTED_VAR_OPTIONS;

  getAllowanceTimeSubscription: Subscription;

  constructor(
    private readonly element: ElementRef,
    private readonly logInfoService: LogInfoService,
    private readonly validationService: ValidationService,
    private readonly saveRequestService: SaveRequestService,
    private readonly addRequestStore: AddRequestStore,
  ) {
    this.tooltip.element = this.element;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filter'] && this.filter.isChangeSubTypeManual) {
      this.mainEvent.subIssueTypeId = Number(this.filter.subIssueTypeId);
      this.handleChangeDefaultFilterArea();
      this.filter.isChangeSubTypeManual = false;
      this.logInfoService.resetIsCheckedVar(this.mainEvent);
    }
  }

  ngOnInit(): void {
    if (this.addRequestStore.getAllowanceTimeSubject) {
      this.getAllowanceTimeSubscription = this.addRequestStore.getAllowanceTimeSubject.subscribe(model => {
        this.defaultFilterTimeWithAllowance.aaTime = model.aaTime;
        this.defaultFilterTimeWithAllowance.paTime = model.paTime;
        this.defaultFilterTimeWithAllowance.saTime = model.saTime;
      });
    }

    if (this.isEdit) {
      this.updateMainEvent(this.mainEvent, this.redCardModels);
      this.updateDefaultFilterTime(this.defaultFilterTimeWithAllowance, this.redCardModels, this.filter);
      this.primitiveProps.isShowLogInfoMainMatch = true;
    } else {
      this.initDefaultMainEvent(this.mainEvent);
      this.initDefaultFilterTime(this.defaultFilterTimeWithAllowance);
      this.primitiveProps.filterBy = TVSRequestFilterBy.CHECK_TIME;
    }
  }

  ngOnDestroy(): void {
    this.getAllowanceTimeSubscription?.unsubscribe();
  }

  private initDefaultFilterTime(defaultFilter: FilterTimeWithAllowance): void {
    const currentMoment = moment.utc().tz('America/Caracas');
    defaultFilter.fromDateTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    defaultFilter.toDateTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  private initDefaultMainEvent(mainEvent: LogInfoRedCard): void {
    mainEvent.isMainMatch = true;
  }

  private updateMainEvent(mainEvent: LogInfoRedCard, inputModels: RedCardModel[]): void {
    const eventSource = inputModels.find(x => x.isMainMatch);
    mainEvent.matchId = eventSource.matchId;
    mainEvent.subIssueTypeId = eventSource.subIssueTypeId;
    mainEvent.isCheckedVar = eventSource.isCheckedVar;
    mainEvent.isMainMatch = true;
    mainEvent.eventName = eventSource.name;
    mainEvent.logInfoDetail = eventSource.logInfoDetail;
    mainEvent.voidTimeArea = {
      fromDateTime: eventSource.voidFromTime,
      toDateTime: eventSource.voidToTime,
      aaTime: eventSource.aaTime,
      paTime: eventSource.paTime,
      saTime: eventSource.saTime
    } as FilterTimeWithAllowance;

    this.addRequestStore.changeAllowanceTime({
      aaTime: eventSource.aaTime,
      paTime: eventSource.paTime,
      saTime: eventSource.saTime,
    });

    this.primitiveProps.filterBy = eventSource.filterBy;
  }

  private updateDefaultFilterTime(defaultFilter: FilterTimeWithAllowance, inputModels: RedCardModel[], filterModel: FilterModel): void {
    const eventSource = inputModels.find(x => x.isMainMatch);
    defaultFilter.fromDateTime = eventSource.filterFromTransTime;
    defaultFilter.toDateTime = eventSource.filterToTransTime;
  }

  async handleSearchEvent(): Promise<void> {
    this.primitiveProps.isShowLogInfoMainMatch = false;
    this.logInfoService.resetAllEventBeforeSearch(this.mainEvent, this.defaultFilterTimeWithAllowance, Number(this.filter.subIssueTypeId));

    if (!this.validationService.validateCommonData(this.filter, this.leagueEventRedCardComponent, this.filterTimeAreaComponent, this.logInfoComponents, this.addRequestStore)) {
      return;
    }

    if (this.mainEvent.isCheckedVar == null && this.isShowVarCheck()) {
      this.mainEvent.isHighLightVarCheck = true;
      return;
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo([this.mainEvent], this.primitiveProps, this.isEdit, this.requestId, this.filter, this.defaultFilterTimeWithAllowance);
    this.logInfoComponents.forEach(x => {
      x.filterTimeWithAllowanceComponent?.updateData();
      x.showValidationDetail();
    });
    this.addRequestStore.changeSavingRequestStatus(false);
    this.addRequestStore.changeBlockingUiStatus(false);
    this.primitiveProps.isShowLogInfoMainMatch = true;
  }

  changeMatchEvent(): void {
    this.primitiveProps.isShowLogInfoMainMatch = false;
    this.logInfoService.resetAllEventBeforeSearch(this.mainEvent, this.defaultFilterTimeWithAllowance, Number(this.filter.subIssueTypeId));
    this.mainEvent.matchId = this.leagueEventRedCardComponent?.selectedMatch.matchId;
    this.mainEvent.eventName = this.leagueEventRedCardComponent?.selectedMatch.name;
    this.updateMatchId.emit(this.leagueEventRedCardComponent?.selectedMatch);
  }

  isExistMatchEvent(): boolean {
    return (this.mainEvent.matchId) ? true : false;
  }

  handleChangeDefaultFilterArea() {
    this.primitiveProps.isShowLogInfoMainMatch = false;
    this.logInfoService.resetAllEventBeforeSearch(this.mainEvent, this.defaultFilterTimeWithAllowance, Number(this.filter.subIssueTypeId));
  }

  async saveRequest(): Promise<void> {
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
  }

   async onClickConfirmSaveRequest() {
    await this.saveRequestService.onClickConfirmSave(this.initSaveRequestInput());
  }

  onClickCancelSaveRequest() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  private initSaveRequestInput() {
    const arg = new SaveRequestArg();
    arg.requestId = this.requestId;
    arg.requestedBy = this.requestedBy;
    arg.userId = this.userId;
    arg.isEdit = this.isEdit;
    arg.actionIdOfFirstTimeAccess = this.actionIdOfFirstTimeAccess;
    arg.filter = this.filter;
    arg.issueTypes = this.issueTypes;
    arg.others = this.others;
    arg.primitiveProps = this.primitiveProps;
    arg.defaultFilterTimeWithAllowance = this.defaultFilterTimeWithAllowance;
    arg.mainEvent = this.mainEvent;
    arg.leagueEventRedCardComponent = this.leagueEventRedCardComponent;
    arg.filterTimeAreaComponent = this.filterTimeAreaComponent;
    arg.logInfoComponents = this.logInfoComponents;
    arg.confirmRedCard = this.confirmRedCard;
    arg.addRequestStore = this.addRequestStore;

    return arg;
  }

  isShowVarCheck(): boolean {
    return this.mainEvent.subIssueTypeId && StaticService.isShowVarCheck(this.mainEvent.subIssueTypeId);
  }

  changeVarCheckValue(isVarChecked: boolean): void {
    this.mainEvent.isCheckedVar = isVarChecked;
    this.mainEvent.isHighLightVarCheck = false;
  }
}
