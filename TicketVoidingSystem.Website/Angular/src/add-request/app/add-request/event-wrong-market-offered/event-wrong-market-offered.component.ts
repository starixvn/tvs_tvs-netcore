
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { AdvancedModeAddRequestComponent } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { AdvancedModeAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.model';
import { GroupBetTypesAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { GetBetTypesQuery, TimeRangeModel } from '../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { ModeType } from '../../../../utility/constants/config';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { ConfirmAddRequestComponent } from '../confirm-add-request/confirm-add-request.component';
import { ConfirmAddRequestModel } from '../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { WrongMarketOfferedModel } from '../models/event-wrong-market-offered.model';
import { OthersModel } from '../others/others.model';
import { FilterTimeComponent } from './filter-time/filter-time.component';
import { LogInfoWrongMarketOfferedComponent } from './log-info-wrong-market-offered/log-info-wrong-market-offered.component';
import { FilterWrongMarketOfferedModel } from './models/filter-wrong-market-offered.model';
import { LogInfoWrongMarketOffered } from './models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventWrongMarketOfferedService } from './services/event-wrong-market-offfered.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { InfoSiteDBDownComponent } from '../components/info-site-db-down/info-site-db-down.component';
import { BetTypeService } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/bet-type.service';

@Component({
  selector: 'event-wrong-market-offered',
  templateUrl: './event-wrong-market-offered.component.html',
  styleUrls: ['./event-wrong-market-offered.component.scss'],
  standalone: true,
  imports: [EventLeagueComponent, FilterTimeComponent, AdvancedModeAddRequestComponent, FormsModule,
    LogInfoWrongMarketOfferedComponent, ConfirmAddRequestComponent, InfoSiteDBDownComponent],
  providers: [LogInfoService, SaveRequestService, ValidationService, EventWrongMarketOfferedService]
})
export class EventWrongMarketOfferedComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() wrongMarketOfferedModels: WrongMarketOfferedModel[];
  @Input() others = new OthersModel();
  @Input() issueTypes = new IssueTypes();
  @Input() actionIdOfFirstTimeAccess: string;
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('eventLeague') eventLeague: EventLeagueComponent;
  @ViewChild('advancedMode') advancedMode: AdvancedModeAddRequestComponent;
  @ViewChild('filterTime') filterTimeComponent: FilterTimeComponent;

  logInfoEvent = new LogInfoWrongMarketOffered();
  groupBetTypesModel = new GroupBetTypesAddRequestModel();
  primitivePropertyEvent = new PrimitivePropertyEvent();
  advancedModeAddRequestModel: AdvancedModeAddRequestModel;
  confirmAddRequest = new ConfirmAddRequestModel();
  private readonly logInfoService = inject(LogInfoService);
  private readonly commonService = inject(CommonService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly validationService = inject(ValidationService);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly eventWrongMarketOfferedService = inject(EventWrongMarketOfferedService);
  private readonly betTypeService = inject(BetTypeService);
  
  async ngOnInit(): Promise<void> {
    if (this.isEdit) {
      this.updateDataWhenEditRequest();
    } else {
      this.logInfoEvent.filterWrongMarketOfferedModels = [this.eventWrongMarketOfferedService.initDefaultTime(1)];
    }
  }

  async getGroupBetTypes() {
    const query: GetBetTypesQuery = {
      mode: ModeType.SPORT_BOOK,
      matchId: this.eventLeague?.selectedMatch.matchId,
      timeRanges: this.logInfoEvent.filterWrongMarketOfferedModels.map(x => this.createTimeRangeModel(x)),
      isGetCancelCashOut: true
    };
    this.addRequestStore.changeBlockingUiStatus(true);
    const data = await this.commonService.getGroupBetTypesTvs(query);
    this.groupBetTypesModel = this.betTypeService.initGroupBetTypesAddRequestModel(_.assignIn([], data.groupBetTypes), true, '', false);;
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  async refreshEvent() {
    if (!this.validationService.validateCommonData(this.eventLeague, this.filterTimeComponent)) {
      return;
    }

    this.resetLogInfo();
    await this.getGroupBetTypes();
    const allBetTypes = this.betTypeService.getAllBetTypes(this.groupBetTypesModel.groupBetTypes);
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
    this.primitivePropertyEvent.infoSiteDBDownModel = null;
    if (!this.validationService.validateCommonData(this.eventLeague, this.filterTimeComponent, this.advancedMode)) {
      return;
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo(this.logInfoEvent, this.isEdit, this.requestId, this.filter, this.primitivePropertyEvent);
    this.primitivePropertyEvent.isShowValidation = true;
    this.addRequestStore.changeBlockingUiStatus(false);
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  async changeMatchEvent(): Promise<void> {
    this.primitivePropertyEvent.isShowValidation = false;
    this.primitivePropertyEvent.infoSiteDBDownModel = null;
    this.updateMatchId.emit(this.logInfoEvent.matchId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (this.eventLeague?.selectedMatch.matchId) {
      this.logInfoEvent.matchId = this.eventLeague.selectedMatch.matchId;
      this.addRequestStore.changeSavingRequestStatus(true);
      this.resetBetTypeAndAdvancedMode();
      this.primitivePropertyEvent.isShowErrorNoBetType = false;
    }
  }

  checkExistBetTypeEvent(isHaveBetType: boolean) {
    this.primitivePropertyEvent.isShowErrorNoBetType = !isHaveBetType;
  }

  checkingLoadDataAdvancedMode(isLoading: boolean): void {
    this.addRequestStore.changeBlockingUiStatus(isLoading);
  }

  changeFilterTime(): void {
    this.addRequestStore.changeSavingRequestStatus(true);
    this.resetBetTypeAndAdvancedMode();
    this.resetLogInfo();
  }

  resetLogInfo(): void {
    this.primitivePropertyEvent.isShowErrorNoBetType = false;
    this.primitivePropertyEvent.isShowValidation = false;
    this.primitivePropertyEvent.infoSiteDBDownModel = null;
  }

  updateDataWhenEditRequest(): void {
    const groupBetTypes = this.wrongMarketOfferedModels[0].groupBetTypes;
    groupBetTypes.forEach(x => x.betTypes.forEach(y => y.isChecked = true));
    const checkedBetTypes = groupBetTypes.flatMap(x => x.betTypes);
    this.logInfoEvent = this.eventWrongMarketOfferedService.assignModelsToEvents(this.wrongMarketOfferedModels);
    this.groupBetTypesModel = this.betTypeService.initGroupBetTypesAddRequestModel(_.assignIn([], groupBetTypes), true, '', this.filter.isVoided);
    const betTeamsResult = this.wrongMarketOfferedModels[0].betTeamsResult;
    betTeamsResult.forEach(x => x.isDisabled = this.filter.isVoided);
    this.advancedModeAddRequestModel = {
      betTeamsResult: betTeamsResult,
      checkedBetTypes: checkedBetTypes,
      selectedAllBetTypes: this.wrongMarketOfferedModels[0].allBetTypesSelection
    };
    this.primitivePropertyEvent.isShowValidation = true;
  }

  async onClickConfirmSaveRequest() {
    await this.saveRequestService.onClickConfirmSave(this.initSaveRequestInput());
  }

  onClickCancelSaveRequest() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  private resetBetTypeAndAdvancedMode() {
    this.advancedMode?.clearBetTeam();
    this.groupBetTypesModel = this.betTypeService.initGroupBetTypesAddRequestModel([], true, '', false);
  }

  private createTimeRangeModel(filterWrongMarketOfferedModel: FilterWrongMarketOfferedModel): TimeRangeModel {
    return {
      fromDate: filterWrongMarketOfferedModel.fromDateTime,
      toDate: filterWrongMarketOfferedModel.toDateTime
    }
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
    arg.issueTypes = this.issueTypes;
    arg.primitiveProps = this.primitivePropertyEvent;
    arg.filterTimeComponent = this.filterTimeComponent;
    arg.eventLeagueComponent = this.eventLeague;
    arg.logInfoEvent = this.logInfoEvent;
    arg.addRequestStore = this.addRequestStore;
    arg.advancedModeComponent = this.advancedMode;
    arg.confirmAddRequest = this.confirmAddRequest;

    return arg;
  }
}
