import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { AdvancedModeAddRequestComponent } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { AdvancedModeAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.model';
import { GroupBetTypesAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { GetBetTypesQuery, TimeRangeModel } from '../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { DateTimeFormat, ModeType } from '../../../../utility/constants/config';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { ConfirmAddRequestModel } from '../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { TechnicalErrorModel } from '../models/event-technical-error.model';
import { OthersModel } from '../others/others.model';
import { FilterTimeTechnicalErrorComponent } from './filter-time-technical-error/filter-time-technical-error.component';
import { FilterTechnicalErrorModel } from './models/filter-technical-error.model';
import { LogInfoTechnicalError } from './models/log-info-technical-error.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventTechnicalErrorService } from './services/event-technical-error.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-technical-error',
  templateUrl: './event-technical-error.component.html',
  styleUrls: ['./event-technical-error.component.scss']
})
export class EventTechnicalErrorComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() issueTypes = new IssueTypes();
  @Input() technicalErrorModel: TechnicalErrorModel;
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('eventLeague') eventLeague: EventLeagueComponent;
  @ViewChild('advancedMode') advancedMode: AdvancedModeAddRequestComponent;
  @ViewChild('filterTime') filterTimeComponent: FilterTimeTechnicalErrorComponent;
  constructor(
    private readonly logInfoService: LogInfoService,
    private readonly commonService: CommonService,
    private readonly addRequestStore: AddRequestStore,
    private readonly validationService: ValidationService,
    private readonly saveRequestService: SaveRequestService,
    private readonly eventTechnicalErrorService: EventTechnicalErrorService,
  ) {}
  logInfoEvent = new LogInfoTechnicalError();
  groupBetTypesModel = new GroupBetTypesAddRequestModel([], false, '', false);
  primitivePropertyEvent = new PrimitivePropertyEvent();
  advancedModeAddRequestModel: AdvancedModeAddRequestModel;
  confirmAddRequest = new ConfirmAddRequestModel();

  async ngOnInit(): Promise<void> {
    if (this.isEdit)  {
      this.updateDataWhenEditRequest();
    } else {
      this.initDefaultTime(this.logInfoEvent.filterTechnicalErrorModel);
    }
  }

  updateDataWhenEditRequest(): void {
    const groupBetTypes = this.technicalErrorModel.groupBetTypes;
    groupBetTypes.forEach(x => x.betTypes.forEach(y => y.isChecked = true));
    const checkedBetTypes = groupBetTypes.flatMap(x => x.betTypes);
    this.logInfoEvent = this.eventTechnicalErrorService.assignModelsToEvents(this.technicalErrorModel);
    this.groupBetTypesModel = new GroupBetTypesAddRequestModel(_.assignIn([], groupBetTypes), true, '', this.filter.isVoided);
    const betTeamsResult = this.technicalErrorModel.betTeamsResult;
    betTeamsResult.forEach(x => x.isDisabled = this.filter.isVoided);
    this.advancedModeAddRequestModel = {
      betTeamsResult: betTeamsResult,
      checkedBetTypes: checkedBetTypes,
      selectedAllBetTypes: this.technicalErrorModel.allBetTypesSelection
    };
    this.primitivePropertyEvent.isShowValidation = true;
  }

  async getGroupBetTypes() {
    const query: GetBetTypesQuery = {
      mode: ModeType.SPORT_BOOK,
      matchId: this.eventLeague?.selectedMatch.matchId,
      timeRanges: [this.createTimeRangeModel(this.logInfoEvent.filterTechnicalErrorModel)]
    };
    this.addRequestStore.changeBlockingUiStatus(true);
    const data = await this.commonService.getGroupBetTypesTvs(query);
    this.groupBetTypesModel = new GroupBetTypesAddRequestModel(_.assignIn([], data.groupBetTypes), true, '', false);;
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  initDefaultTime(filterTime: FilterTechnicalErrorModel): void {
    const currentMoment = moment.utc().tz('America/Caracas');
    filterTime.fromDateTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    filterTime.toDateTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  changeFilterTime(): void {
    this.addRequestStore.changeSavingRequestStatus(true);
    this.resetBetTypeAndAdvancedMode();
    this.resetLogInfo();
  }

  resetLogInfo(): void {
    this.primitivePropertyEvent.isShowErrorNoBetType = false;
    this.primitivePropertyEvent.isShowValidation = false;
  }

  async refreshEvent() {
    if (!this.validationService.validateCommonData(this.eventLeague, this.filterTimeComponent)) {
      return;
    }

    this.resetLogInfo();
    await this.getGroupBetTypes();
    const allBetTypes = this.groupBetTypesModel.getAllBetTypes();
    this.advancedMode?.changeBetTypes(allBetTypes);
    this.advancedMode?.resetAllBetTeams();
    if (allBetTypes.length === 0) {
      this.primitivePropertyEvent.isShowErrorNoBetType = true;
    }
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  async clickSearch(): Promise<void> {
    this.logInfoEvent.betTeamsResult = this.advancedMode.getCheckedBetTypes();
    this.primitivePropertyEvent.isShowValidation = false;
    if (!this.validationService.validateCommonData(this.eventLeague, this.filterTimeComponent, this.advancedMode)) {
      return;
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo(this.logInfoEvent, this.isEdit, this.requestId, this.filter, this.primitivePropertyEvent);
    this.primitivePropertyEvent.isShowValidation = true;
    this.addRequestStore.changeBlockingUiStatus(false);
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  checkingLoadDataAdvancedMode(isLoading: boolean): void {
    this.addRequestStore.changeBlockingUiStatus(isLoading);
  }

  async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  checkExistBetTypeEvent(isHaveBetType: boolean) {
    this.primitivePropertyEvent.isShowErrorNoBetType = !isHaveBetType;
  }

  async onClickConfirmSaveRequest() {
    await this.saveRequestService.onClickConfirmSave(this.initSaveRequestInput());
  }

  onClickCancelSaveRequest() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  async changeMatchEvent(): Promise<void> {
    this.primitivePropertyEvent.isShowValidation = false;
    this.updateMatchId.emit(this.logInfoEvent.matchId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (this.eventLeague?.selectedMatch.matchId) {
      this.logInfoEvent.matchId = this.eventLeague.selectedMatch.matchId;
      this.addRequestStore.changeSavingRequestStatus(true);
      this.resetBetTypeAndAdvancedMode();
      this.primitivePropertyEvent.isShowErrorNoBetType = false;
    }
  }

  private resetBetTypeAndAdvancedMode() {
    this.advancedMode?.clearBetTeam();
    this.groupBetTypesModel = new GroupBetTypesAddRequestModel([], true, '', false);
  }

  private initSaveRequestInput() {
    if (!this.filter.isVoided) {
      this.logInfoEvent.betTeamsResult = this.advancedMode.getCheckedBetTypes();
      this.logInfoEvent.allBetTypesSelection = this.advancedMode.advancedModeComponent.getAllBetTypesSelection();
    }
    const arg = new SaveRequestArg();
    arg.requestId = this.requestId;
    arg.requestedBy = this.requestedBy;
    arg.isEdit = this.isEdit;
    arg.userId = this.userId;
    arg.actionIdOfFirstTimeAccess = this.actionIdOfFirstTimeAccess;
    arg.others = this.others;
    arg.filter = this.filter;
    arg.primitiveProps = this.primitivePropertyEvent;
    arg.filterTimeComponent = this.filterTimeComponent;
    arg.eventLeagueComponent = this.eventLeague;
    arg.logInfoEvent = this.logInfoEvent;
    arg.addRequestStore = this.addRequestStore;
    arg.advancedModeComponent = this.advancedMode;
    arg.confirmAddRequest = this.confirmAddRequest;

    return arg;
  }

  private createTimeRangeModel(filterWrongOddsSportsBook: FilterTechnicalErrorModel): TimeRangeModel {
    return {
      fromDate: filterWrongOddsSportsBook.fromDateTime,
      toDate: filterWrongOddsSportsBook.toDateTime
    }
  }
}
