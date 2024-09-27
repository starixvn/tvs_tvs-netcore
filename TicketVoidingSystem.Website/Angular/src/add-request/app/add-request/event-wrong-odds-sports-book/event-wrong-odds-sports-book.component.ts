import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AdvancedModeAddRequestComponent } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { AdvancedModeAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.model';
import { GroupBetTypesAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { GetBetTypesQuery } from '../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { ModeType } from '../../../../utility/constants/config';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { ConfirmAddRequestModel } from '../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { WrongOddsSportsBookModel } from '../models/event-wrong-odds-sports-book.model';
import { OthersModel } from '../others/others.model';
import { FilterWrongOddsSportsBookComponent } from './filter-wrong-odds-sports-book/filter-wrong-odds-sports-book.component';
import { LogInfoWrongOddsSportsBook } from './models/log-info-wrong-odds-sports-book.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventWrongOddsSportsBookService } from './services/event-wrong-odds-sports-book.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-wrong-odds-sports-book',
  templateUrl: './event-wrong-odds-sports-book.component.html',
  styleUrls: ['./event-wrong-odds-sports-book.component.scss']
})
export class EventWrongOddsSportsBookSportsBookComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() issueTypeId: string;
  @Input() others = new OthersModel();
  @Input() issueTypes = new IssueTypes();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() wrongOddsSportsBookModel: WrongOddsSportsBookModel;
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('eventLeague') eventLeagueComponent: EventLeagueComponent;
  @ViewChild('filterWrongOddsSportsBook') filterWrongOddsSportsBookComponent: FilterWrongOddsSportsBookComponent;
  @ViewChild('advancedMode') advancedMode: AdvancedModeAddRequestComponent;

  groupBetTypesModel = new GroupBetTypesAddRequestModel([], false, '', false);
  advancedModeAddRequestModel: AdvancedModeAddRequestModel;
  logInfoEvent = new LogInfoWrongOddsSportsBook();
  confirmAddRequest = new ConfirmAddRequestModel();
  primitiveProps = new PrimitiveProperty();

  constructor(
    private readonly validationService: ValidationService,
    private readonly eventWrongOddsSportsBookService: EventWrongOddsSportsBookService,
    private readonly logInfoService: LogInfoService,
    private readonly addRequestStore: AddRequestStore,
    private readonly saveRequestService: SaveRequestService,
    private readonly commonService: CommonService
  ) { }

  ngOnInit() {
    if (this.isEdit) {
      this.updateDataWhenEditRequest();
    } else {
      this.logInfoEvent = this.eventWrongOddsSportsBookService.initDefaultLogInfoWrongOddsSportsBook();
    }
  }

  public updateDataWhenEditRequest(): void {
    const groupBetTypes = this.wrongOddsSportsBookModel.groupBetTypes;
    groupBetTypes.forEach(x => x.betTypes.forEach(y => y.isChecked = true));
    const checkedBetTypes = groupBetTypes.flatMap(x => x.betTypes);
    this.logInfoEvent = this.eventWrongOddsSportsBookService.assignModelsToEvents(this.wrongOddsSportsBookModel);
    this.groupBetTypesModel = new GroupBetTypesAddRequestModel(_.assignIn([], groupBetTypes), true, '', this.filter.isVoided);
    this.logInfoEvent.checkedBetTypes = this.groupBetTypesModel.getCheckedBetTypes();
    const betTeamsResult = this.wrongOddsSportsBookModel.betTeamsResult;
    betTeamsResult.forEach(x => x.isDisabled = this.filter.isVoided);
    this.advancedModeAddRequestModel = {
      betTeamsResult: betTeamsResult,
      checkedBetTypes: checkedBetTypes
    };
    this.primitiveProps.isShowValidation = true;
  }

  async refreshEvent() {
    if (!this.validationService.validateCommonData(this.eventLeagueComponent, this.filterWrongOddsSportsBookComponent)) {
      return;
    }
    this.resetLogInfo();
    await this.getGroupBetTypes();
    const allBetTypes = this.groupBetTypesModel.getAllBetTypes();
    this.advancedMode?.changeBetTypes(allBetTypes);
    if (allBetTypes.length === 0) {
      this.primitiveProps.isShowErrorNoBetType = true;
    }
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  async handleSearchEvent(): Promise<void> {
    this.logInfoEvent.betTeamsResult = this.advancedMode.getCheckedBetTypes();
    this.primitiveProps.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (!this.validationService.validateCommonData(this.eventLeagueComponent, this.filterWrongOddsSportsBookComponent, this.advancedMode)) {
      return;
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo(this.logInfoEvent, this.isEdit, this.requestId, this.filter, this.primitiveProps);
    this.logInfoEvent.checkedBetTypes = this.groupBetTypesModel.getCheckedBetTypes();
    this.primitiveProps.isShowValidation = true;
    this.addRequestStore.changeBlockingUiStatus(false);
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  async getGroupBetTypes() {
    const query: GetBetTypesQuery = {
      mode: ModeType.SPORT_BOOK,
      matchId: this.eventLeagueComponent?.selectedMatch.matchId,
      fromTransDate: this.logInfoEvent.filterWrongOddsSportsBook.fromDateTime,
      toTransDate: this.logInfoEvent.filterWrongOddsSportsBook.toDateTime,
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

  async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  resetLogInfo(): void {
    this.primitiveProps.isShowErrorNoBetType = false;
    this.primitiveProps.isShowValidation = false;
  }

  checkExistBetTypeEvent(isHaveBetType: boolean) {
    this.primitiveProps.isShowErrorNoBetType = !isHaveBetType;
  }

  initSaveRequestInput() {
    const arg = new SaveRequestArg();
    if (!this.filter.isVoided) {
      this.logInfoEvent.betTeamsResult = this.advancedMode.getCheckedBetTypes();
    }
    arg.requestId = this.requestId;
    arg.requestedBy = this.requestedBy;
    arg.isEdit = this.isEdit;
    arg.userId = this.userId;
    arg.actionIdOfFirstTimeAccess = this.actionIdOfFirstTimeAccess;
    arg.others = this.others;
    arg.filter = this.filter;
    arg.primitiveProps = this.primitiveProps;
    arg.issueTypes = this.issueTypes;
    arg.filterWrongOddsSportsBookComponent = this.filterWrongOddsSportsBookComponent;
    arg.eventLeagueComponent = this.eventLeagueComponent;
    arg.advancedModeComponent = this.advancedMode;
    arg.logInfoEvent = this.logInfoEvent;
    arg.confirmAddRequest = this.confirmAddRequest;
    arg.addRequestStore = this.addRequestStore;

    return arg;
  }

  public async changeMatchEvent(): Promise<void> {
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    this.primitiveProps.isShowValidation = false;
    this.updateMatchId.emit(this.logInfoEvent.matchId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (this.eventLeagueComponent?.selectedMatch.matchId) {
      this.logInfoEvent.matchId = this.eventLeagueComponent.selectedMatch.matchId;
      this.addRequestStore.changeSavingRequestStatus(true);
      this.resetBetTypeAndAdvancedMode();
      this.primitiveProps.isShowErrorNoBetType = false;
    }
  }

  private resetBetTypeAndAdvancedMode() {
    this.advancedMode?.clearBetTeam();
    this.groupBetTypesModel = new GroupBetTypesAddRequestModel([], true, '', false);
  }

  async onClickConfirmSaveRequest() {
    await this.saveRequestService.onClickConfirmSave(this.initSaveRequestInput());
  }

  onClickCancelSaveRequest() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  resetLogInfoOfEvent(): void {
    this.primitiveProps.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
  }
}
