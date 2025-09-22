
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { ConfirmAddRequestComponent } from '../../../../component/confirm-add-request/confirm-add-request.component';
import { ConfirmAddRequestModel } from '../../../../component/confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../../../../component/filter/filter.model';
import { IssueTypes } from '../../../../component/filter/issue-types.model';
import { InfoSiteDBDownComponent } from '../../../../component/info-site-db-down/info-site-db-down.component';
import { OthersModel } from '../../../../component/others/others.model';
import { NotParticipateModel } from '../../../../models/event-not-participate.model';
import { AddRequestStore } from '../../../../services/add-request.store';
import { FilterNotParticipateComponent } from './filter-not-participate/filter-not-participate.component';
import { LogInfoNotParticipateComponent } from './log-info-not-participate/log-info-not-participate.component';
import { LogInfoNotParticipate } from './models/log-info-not-participate.model';
import { NotParticipateBetTypeModel, Player } from './models/not-participate-bet-type.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventNotParticipateService } from './services/event-not-participate.service';
import { FilterNotParticipateService } from './services/filter-not-participate.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-not-participate',
  templateUrl: './event-not-participate.component.html',
  standalone: true,
  imports: [FormsModule, EventLeagueComponent, FilterNotParticipateComponent, LogInfoNotParticipateComponent, InfoSiteDBDownComponent, ConfirmAddRequestComponent],
  providers: [ValidationService, SaveRequestService, EventNotParticipateService, FilterNotParticipateService, LogInfoService]
})
export class EventNotParticipateComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() issueTypeId: string;
  @Input() issueTypes = new IssueTypes();
  @Input() notParticipateModels: NotParticipateModel[] = [];
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('leagueEvent') eventLeagueComponent: EventLeagueComponent;
  @ViewChild('filterNotParticipate') filterNotParticipateComponent: FilterNotParticipateComponent;

  logInfoEvent = new LogInfoNotParticipate();
  primitivePropertyEvent = new PrimitivePropertyEvent();
  originalPlayers: Player[];
  originalBetTypes: NotParticipateBetTypeModel[];
  confirmAddRequest = new ConfirmAddRequestModel();

  private readonly validationService = inject(ValidationService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly logInfoService = inject(LogInfoService);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly eventNotParticipateService = inject(EventNotParticipateService);
  private readonly filterService = inject(FilterNotParticipateService);

  async ngOnInit(): Promise<void> {
    if (this.isEdit) {
      this.logInfoEvent = this.eventNotParticipateService.assignModelsToEvents(this.notParticipateModels);
      await this.updateModelWhenChangeMatchId();
      this.logInfoEvent.filterNotParticipates.forEach(x => {
        x.betTypeMultipleSelection = this.filterService.initDefaultBetTypeSelection();
      });
      this.primitivePropertyEvent.isShowFilterArea = true;
      this.primitivePropertyEvent.isShowValidation = true;
    }
  }

  private async updateModelWhenChangeMatchId(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    const viewModel = await this.filterService.getNotParticipateBetTypes(this.logInfoEvent.matchId);
    this.originalPlayers = viewModel.notParticipatePlayers;
    this.originalBetTypes = viewModel.notParticipateBetTypes;
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  public async clickSearch(): Promise<void> {
    this.primitivePropertyEvent.isShowValidation = false;
    this.primitivePropertyEvent.infoSiteDBDownModel = null;
    if (!this.validationService.validateCommonData(this.eventLeagueComponent, this.filterNotParticipateComponent)) {
      return;
    }

    this.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo(this.logInfoEvent, this.isEdit, this.requestId, this.filter, this.primitivePropertyEvent);
    this.primitivePropertyEvent.isShowValidation = true;
    this.addRequestStore.changeBlockingUiStatus(false);
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
    this.addRequestStore.changeBlockingUiStatus(false);
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
    arg.primitiveProps = this.primitivePropertyEvent;
    arg.filterNotParticipateComponent = this.filterNotParticipateComponent;
    arg.eventLeagueComponent = this.eventLeagueComponent;
    arg.logInfoEvent = this.logInfoEvent;
    arg.addRequestStore = this.addRequestStore;
    arg.confirmAddRequest = this.confirmAddRequest;

    return arg;
  }

  public async changeMatchEvent(): Promise<void> {
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    this.primitivePropertyEvent.isShowFilterArea = false;
    this.primitivePropertyEvent.isShowValidation = false;
    this.primitivePropertyEvent.infoSiteDBDownModel = null;
    this.updateMatchId.emit(this.logInfoEvent.matchId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);

    if (this.eventLeagueComponent?.selectedMatch.matchId) {
      this.logInfoEvent.matchId = this.eventLeagueComponent.selectedMatch.matchId;
      await this.updateModelWhenChangeMatchId();
      this.resetFilterNotParticipate();
      this.primitivePropertyEvent.isShowFilterArea = true;
    }
  }

  async onClickConfirmSaveRequest() {
    await this.saveRequestService.onClickConfirmSave(this.initSaveRequestInput());
  }

  onClickCancelSaveRequest() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public resetLogInfoOfEvent(): void {
    this.primitivePropertyEvent.isShowValidation = false;
    this.primitivePropertyEvent.infoSiteDBDownModel = null;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
  }

  public resetFilterNotParticipate(): void {
    this.logInfoEvent.filterNotParticipates = [];
    this.initDefaultFilterNotParticipateItem();
  }

  private initDefaultFilterNotParticipateItem(): void {
    this.logInfoEvent.filterNotParticipates.push(this.filterService.initDefaultFilter());
  }
}
