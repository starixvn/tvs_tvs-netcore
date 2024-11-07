import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { AddRequestStore } from '../add-request.store';
import { ConfirmAddRequestModel } from '../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { WrongOfferedNameModel } from '../models/event-wrong-offered-name.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { OthersModel } from '../others/others.model';
import { FilterWrongOfferedNameComponent } from './filter-wrong-offered-name/filter-wrong-offered-name.component';
import { LogInfoWrongOfferedName } from './models/log-info-wrong-offered-name.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventWrongOfferedNameService } from './services/event-wrong-offered-name.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-wrong-offered-name',
  templateUrl: './event-wrong-offered-name.component.html',
  styleUrls: ['./event-wrong-offered-name.component.scss']
})
export class EventWrongOfferedNameComponent  implements OnInit {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() issueTypeId: string;
  @Input() others = new OthersModel();
  @Input() issueTypes = new IssueTypes();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() wrongOfferedNameModel: WrongOfferedNameModel;
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('eventLeague') eventLeagueComponent: EventLeagueComponent;
  @ViewChild('filterWrongOfferedName') filterWrongOfferedNameComponent: FilterWrongOfferedNameComponent;
  logInfoEvent = new LogInfoWrongOfferedName();
  confirmAddRequest = new ConfirmAddRequestModel();
  primitiveProps = new PrimitiveProperty();
  permission = new PermissionAddRequest();

  constructor(
    private readonly logInfoService: LogInfoService,
    private readonly addRequestStore: AddRequestStore,
    private readonly validationService: ValidationService,
    private readonly saveRequestService: SaveRequestService,
    private readonly eventWrongOfferedNameService: EventWrongOfferedNameService
  ) {
  }

  async ngOnInit() {
    this.permission = await this.eventWrongOfferedNameService.getPermissionAddRequest();
    if (this.isEdit) {
      await this.updateDataWhenEditRequest();
    } else {
      this.logInfoEvent = this.eventWrongOfferedNameService.initLogInfoEvent();
    }
  }

  async updateDataWhenEditRequest() {
    this.logInfoEvent = await this.eventWrongOfferedNameService.assignModelsToEvents(this.filter, this.wrongOfferedNameModel);
    this.primitiveProps.isShowLogInfo = true;
  }

  async changeMatchEvent(): Promise<void> {
    this.primitiveProps.isShowLogInfo = false;
    this.updateMatchId.emit(this.logInfoEvent.matchId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (this.eventLeagueComponent?.selectedMatch.matchId) {
      this.logInfoEvent.matchId = this.eventLeagueComponent.selectedMatch.matchId;
      this.logInfoEvent.matchModel = this.eventLeagueComponent.selectedMatch;
      this.eventWrongOfferedNameService.updateSelectedMatchToInput(this.eventLeagueComponent.selectedMatch, this.logInfoEvent.filterWrongOfferedName, this.filter.subIssueTypeId);
    }
  }

  async handleSearchEvent(): Promise<void> {
    this.primitiveProps.isShowLogInfo = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    if (!this.validationService.validateCommonData(this.eventLeagueComponent, this.filterWrongOfferedNameComponent)) {
      return;
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo(this.logInfoEvent, this.isEdit, this.requestId, this.filter, this.primitiveProps);

    if (!this.validationService.isAccountHasAddRequestPermission(this.filter.action, this.logInfoEvent.isHasInstantlySettledTicket,
      this.logInfoEvent.isHasSettledTicket, this.permission)) {
      this.addRequestStore.changeBlockingUiStatus(false);
      return;
    }

    this.primitiveProps.isShowLogInfo = true;
    this.addRequestStore.changeBlockingUiStatus(false);
    this.addRequestStore.changeSavingRequestStatus(false);
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

  resetLogInfo() {
    this.primitiveProps.isShowLogInfo = false;
  }

  initSaveRequestInput() {
    const arg = new SaveRequestArg();
    arg.requestId = this.requestId;
    arg.requestedBy = this.requestedBy;
    arg.isEdit = this.isEdit;
    arg.userId = this.userId;
    arg.actionIdOfFirstTimeAccess = this.actionIdOfFirstTimeAccess;
    arg.others = this.others;
    arg.filter = this.filter;
    arg.primitiveProps = this.primitiveProps;
    arg.issueTypes = this.issueTypes;
    arg.filterWrongOfferedNameComponent = this.filterWrongOfferedNameComponent;
    arg.eventLeagueComponent = this.eventLeagueComponent;
    arg.logInfoEvent = this.logInfoEvent;
    arg.confirmAddRequest = this.confirmAddRequest;
    arg.addRequestStore = this.addRequestStore;
    arg.permission = this.permission;

    return arg;
  }
}
