import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { AdvancedModeAddRequestComponent } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { AdvancedModeAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.model';
import { GroupBetTypesAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { GetBetTypesQuery } from '../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { DateTimeFormat, ModeType } from '../../../../utility/constants/config';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongMarketOfferedModel } from '../models/event-wrong-market-offered.model';
import { OthersModel } from '../others/others.model';
import { FilterTimeComponent } from './filter-time/filter-time.component';
import { FilterWrongMarketOfferedModel } from './models/filter-wrong-market-offered.model';
import { LogInfoWrongMarketOffered } from './models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventWrongMarketOfferedService } from './services/event-wrong-market-offfered.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-wrong-market-offered',
  templateUrl: './event-wrong-market-offered.component.html',
  styleUrls: ['./event-wrong-market-offered.component.scss']
})
export class EventWrongMarketOfferedComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() wrongMarketOfferedModel: WrongMarketOfferedModel;
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('eventLeague') eventLeague: EventLeagueComponent;
  @ViewChild('advancedMode') advancedMode: AdvancedModeAddRequestComponent;
  @ViewChild('filterTime') filterTimeComponent: FilterTimeComponent;
  constructor(
    private readonly logInfoService: LogInfoService,
    private readonly commonService: CommonService,
    private readonly addRequestStore: AddRequestStore,
    private readonly validationService: ValidationService,
    private readonly saveRequestService: SaveRequestService,
    private readonly eventWrongMarketOfferedService: EventWrongMarketOfferedService,
  ) {}
  logInfoEvent = new LogInfoWrongMarketOffered();
  groupBetTypesModel = new GroupBetTypesAddRequestModel([], false, '', false);
  primitivePropertyEvent = new PrimitivePropertyEvent();
  advancedModeAddRequestModel: AdvancedModeAddRequestModel;

  async ngOnInit(): Promise<void> {
    if (this.isEdit)  {
      this.updateDataWhenEditRequest();
    } else {
      this.initDefaultTime(this.logInfoEvent.filterWrongMarketOfferedModel);
    }
  }

  public updateDataWhenEditRequest(): void {
    const groupBetTypes = this.wrongMarketOfferedModel.groupBetTypes;
    groupBetTypes.forEach(x => x.betTypes.forEach(y => y.isChecked = true));
    const checkedBetTypes = groupBetTypes.flatMap(x => x.betTypes);
    this.logInfoEvent = this.eventWrongMarketOfferedService.assignModelsToEvents(this.wrongMarketOfferedModel);
    this.groupBetTypesModel = new GroupBetTypesAddRequestModel(_.assignIn([], groupBetTypes), true, '', this.filter.isVoided);
    this.logInfoEvent.checkedBetTypes = this.groupBetTypesModel.getCheckedBetTypes();
    const betTeamsResult = this.wrongMarketOfferedModel.betTeamsResult;
    betTeamsResult.forEach(x => x.isDisabled = this.filter.isVoided);
    this.advancedModeAddRequestModel = {
      betTeamsResult: betTeamsResult,
      checkedBetTypes: checkedBetTypes
    };
    this.primitivePropertyEvent.isShowFilterArea = true;
    this.primitivePropertyEvent.isShowValidation = true;
  }

  async getGroupBetTypes() {
    const query: GetBetTypesQuery = {
      mode: ModeType.SPORT_BOOK,
      matchId: this.eventLeague?.selectedMatch.matchId,
      fromTransDate: this.logInfoEvent.filterWrongMarketOfferedModel.fromDateTime,
      toTransDate: this.logInfoEvent.filterWrongMarketOfferedModel.toDateTime,
      isGetCancelCashOut: true
    };
    this.addRequestStore.changeBlockingUiStatus(true);
    const data = await this.commonService.getGroupBetTypesTvs(query);
    const newGroupBetTypes = new GroupBetTypesAddRequestModel(_.assignIn([], data.groupBetTypes), true, '', false);
    this.groupBetTypesModel = this.assignCurrentStateToNewGroupBetType(newGroupBetTypes);
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  assignCurrentStateToNewGroupBetType(newGroupBetTypes: GroupBetTypesAddRequestModel): GroupBetTypesAddRequestModel {
    const currentCheckedBetTypes = this.groupBetTypesModel.groupBetTypes.flatMap(x => x.betTypes).filter(x => x.isChecked);
    const newGroupBetTypesList = newGroupBetTypes.groupBetTypes.flatMap(x => x.betTypes);

    currentCheckedBetTypes.forEach(x => {
      const model = newGroupBetTypesList.find(z => z.id === x.id);
      if(model) {
        model.isChecked = true;
      }
    });
    return newGroupBetTypes;
  }

  initDefaultTime(filterTime: FilterWrongMarketOfferedModel): void {
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
    this.logInfoEvent.checkedBetTypes = this.groupBetTypesModel.getCheckedBetTypes();
    this.primitivePropertyEvent.isShowValidation = true;
    this.addRequestStore.changeBlockingUiStatus(false);
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  checkExistBetTypeEvent(isHaveBetType: boolean) {
    this.primitivePropertyEvent.isShowErrorNoBetType = !isHaveBetType;
  }

  public async changeMatchEvent(): Promise<void> {
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    this.primitivePropertyEvent.isShowFilterArea = false;
    this.primitivePropertyEvent.isShowValidation = false;
    this.updateMatchId.emit(this.logInfoEvent.matchId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (this.eventLeague?.selectedMatch.matchId) {
      this.logInfoEvent.matchId = this.eventLeague.selectedMatch.matchId;
      this.addRequestStore.changeSavingRequestStatus(true);
      this.resetBetTypeAndAdvancedMode();
      this.primitivePropertyEvent.isShowFilterArea = true;
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

    return arg;
  }
}
