
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { ConfirmAddRequestComponent } from '../../../../component/confirm-add-request/confirm-add-request.component';
import { ConfirmAddRequestModel } from '../../../../component/confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../../../../component/filter/filter.model';
import { IssueTypes } from '../../../../component/filter/issue-types.model';
import { InfoSiteDBDownComponent } from '../../../../component/info-site-db-down/info-site-db-down.component';
import { OthersModel } from '../../../../component/others/others.model';
import { WrongOddsModel } from '../../../../models/event-wrong-odds.model';
import { AddRequestApiService } from '../../../../services/add-request-api.service';
import { AddRequestStore } from '../../../../services/add-request.store';
import { FilterWrongOddsComponent } from './filter-wrong-odds/filter-wrong-odds.component';
import { LogInfoWrongOddsComponent } from './log-info-wrong-odds/log-info-wrong-odds.component';
import { MaxBetAndSpreadInfo } from './models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from './models/log-info-wrong-odds.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { CalculateOddsService } from './services/calculate-odds.service';
import { EventWrongOddsService } from './services/event-wrong-odds.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  standalone: true,
  selector: 'event-wrong-odds',
  templateUrl: './event-wrong-odds.component.html',
  imports: [EventLeagueComponent, FilterWrongOddsComponent, FormsModule, LogInfoWrongOddsComponent, InfoSiteDBDownComponent,
    ConfirmAddRequestComponent
  ],
  providers: [ ValidationService, EventWrongOddsService, LogInfoService,
    SaveRequestService, CalculateOddsService, AddRequestApiService ]
})
export class EventWrongOddsComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() wrongOddsModels: WrongOddsModel[] = [];
  @Input() issueTypes = new IssueTypes();
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('leagueEvent') eventLeagueComponent: EventLeagueComponent;
  @ViewChild('filterWrongOdds') filterWrongOddsComponent: FilterWrongOddsComponent;
  logInfoEvent = new LogInfoWrongOdds();
  primitiveProps = new PrimitiveProperty();
  confirmAddRequest = new ConfirmAddRequestModel();

  private readonly validationService = inject(ValidationService);
  private readonly eventWrongOddsService = inject(EventWrongOddsService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly calculateOddsService = inject(CalculateOddsService);
  private readonly addRequestApiService = inject(AddRequestApiService);

  ngOnInit(): void {
    if (this.isEdit) {
      this.logInfoEvent = this.eventWrongOddsService.assignModelsToEvents(this.wrongOddsModels[0]);
    } else {
      this.logInfoEvent = this.eventWrongOddsService.initDefaultLogInfoWrongOdds();
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['filter'] && this.filter.isChangeSubTypeManual) {
      if (!this.filterWrongOddsComponent.filterWrongOddsModel.maxBetAndSpreadInfo && this.eventLeagueComponent.selectedMatch.matchId) {
        this.filterWrongOddsComponent.filterWrongOddsModel.maxBetAndSpreadInfo = await this.GetMaxBetAndSpreadOfEvent();
      }

      this.resetPoolHouseCheckedBetTypes();
      this.calculateOddsService.resetOddsInfo(this.filterWrongOddsComponent.filterWrongOddsModel, this.filter.subIssueTypeId);
    }
  }

  public async GetMaxBetAndSpreadOfEvent(): Promise<MaxBetAndSpreadInfo[]> {
    const query = this.calculateOddsService.createMaxBetAndSpreadQuery(this.eventLeagueComponent.selectedMatch);
    return this.addRequestApiService.getMaxBetAndSpreadOfEvent(query);
  }

  public async handleSearchEvent(): Promise<void> {
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    this.primitiveProps.infoSiteDBDownModel = null;

    if (!this.validationService.validateCommonData(this.eventLeagueComponent, this.filterWrongOddsComponent)) {
      return;
    }

    this.calculateOddsService.calculateOddsRange(this.logInfoEvent.filterWrongOdds);
    this.addRequestStore.changeBlockingUiStatus(true);
    this.logInfoEvent.linkedLogsViewModel = await this.eventWrongOddsService.getLinkedLog(this.logInfoEvent, this.filter);
    await this.logInfoService.getLogInfo(this.logInfoEvent, this.isEdit, this.requestId, this.filter, this.primitiveProps);
    this.logInfoEvent.isShowValidation = true;
    this.addRequestStore.changeBlockingUiStatus(false);
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.logInfoEvent.isShowValidation = false;
    this.calculateOddsService.calculateOddsRange(this.logInfoEvent.filterWrongOdds);
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
    arg.primitiveProps = this.primitiveProps;
    arg.filterWrongOddsComponent = this.filterWrongOddsComponent;
    arg.eventLeagueComponent = this.eventLeagueComponent;
    arg.logInfoEvent = this.logInfoEvent;
    arg.addRequestStore = this.addRequestStore;
    arg.confirmAddRequest = this.confirmAddRequest;

    return arg;
  }

  public async changeMatchEvent(): Promise<void> {
    this.logInfoEvent.matchId = this.eventLeagueComponent.selectedMatch?.matchId;
    this.logInfoEvent.sportType = this.eventLeagueComponent?.selectedMatch.sportType;
    await this.calculateOddsService.updateOddsInfo(this.logInfoEvent.filterWrongOdds, this.eventLeagueComponent.selectedMatch, this.filter?.subIssueTypeId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    this.primitiveProps.infoSiteDBDownModel = null;
    this.updateMatchId.emit(this.logInfoEvent.matchId)
  }

  public resetLogInfoOfEvent(): void {
    this.primitiveProps.infoSiteDBDownModel = null;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
  }

  public resetPoolHouseCheckedBetTypes(): void {
    this.eventWrongOddsService.resetPoolHouseCheckedBetTypes(this.logInfoEvent);
  }

  
  async onClickConfirmSaveRequest() {
    await this.saveRequestService.onClickConfirmSave(this.initSaveRequestInput());
  }

  onClickCancelSaveRequest() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }
}
