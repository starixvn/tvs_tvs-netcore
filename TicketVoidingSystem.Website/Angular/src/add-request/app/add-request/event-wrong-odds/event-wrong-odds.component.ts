import { Component, EventEmitter, Input, OnInit, Output, ViewChild, SimpleChanges } from '@angular/core';
import { PoolHouseTicketValue } from '../../../../utility/constants/config';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongOddsModel } from '../models/event-wrong-odds.model';
import { OthersModel } from '../others/others.model';
import { FilterWrongOddsComponent } from './filter-wrong-odds/filter-wrong-odds.component';
import { LogInfoWrongOdds } from './models/log-info-wrong-odds.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventWrongOddsService } from './services/event-wrong-odds.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { CalculateOddsService } from './services/calculate-odds.service';
import { MaxBetAndSpreadInfo } from './models/filter-wrong-odds.model';
import { AddRequestApiService } from '../add-request-api.service';

@Component({
  selector: 'event-wrong-odds',
  templateUrl: './event-wrong-odds.component.html',
  styleUrls: ['./event-wrong-odds.component.scss']
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
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('leagueEvent') eventLeagueComponent: EventLeagueComponent;
  @ViewChild('filterWrongOdds') filterWrongOddsComponent: FilterWrongOddsComponent;
  logInfoEvent = new LogInfoWrongOdds();
  primitiveProps = new PrimitiveProperty();

  constructor(
    private readonly validationService: ValidationService,
    private readonly eventWrongOddsService: EventWrongOddsService,
    private readonly logInfoService: LogInfoService,
    private readonly addRequestStore: AddRequestStore,
    private readonly saveRequestService: SaveRequestService,
    private readonly calculateOddsService: CalculateOddsService,
    private readonly addRequestApiService: AddRequestApiService
    ) { }

  ngOnInit(): void {
    if (this.isEdit) {
      this.logInfoEvent = this.eventWrongOddsService.assignModelsToEvents(this.wrongOddsModels[0]);
    } else {
      this.logInfoEvent = this.eventWrongOddsService.initDefaultLogInfoWrongOdds();
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['filter'] && this.filter.isChangeSubTypeManual) {
      if(!this.filterWrongOddsComponent.filterWrongOddsModel.maxBetAndSpreadInfo && this.eventLeagueComponent.selectedMatch.matchId){
        this.filterWrongOddsComponent.filterWrongOddsModel.maxBetAndSpreadInfo = await this.GetMaxBetAndSpreadOfEvent();
      }

      this.calculateOddsService.resetOddsInfo(this.filterWrongOddsComponent.filterWrongOddsModel, this.filter.subIssueTypeId);
    }
  }

  public async GetMaxBetAndSpreadOfEvent(): Promise<MaxBetAndSpreadInfo[]>{
    const query = this.calculateOddsService.createMaxBetAndSpreadQuery(this.eventLeagueComponent.selectedMatch);
    return await this.addRequestApiService.getMaxBetAndSpreadOfEvent(query);
  }

  public async clickSearch(): Promise<void> {
    this.logInfoEvent.poolHouseCheckedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
    await this.handleSearchEvent();
  }

  public async handleSearchEvent(): Promise<void> {
    this.primitiveProps.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);

    if (!this.validationService.validateCommonData(this.eventLeagueComponent, this.filterWrongOddsComponent)) {
      return;
    }

    this.calculateOddsService.calculateOddsRange(this.logInfoEvent.filterWrongOdds);
    this.addRequestStore.changeBlockingUiStatus(true);
    this.logInfoEvent.linkedLogsViewModel = await this.eventWrongOddsService.getLinkedLog(this.logInfoEvent, this.filter);
    await this.logInfoService.getLogInfo(this.logInfoEvent, this.isEdit, this.requestId, this.filter, this.primitiveProps);
    this.primitiveProps.isShowValidation = true;
    this.addRequestStore.changeBlockingUiStatus(false);
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.primitiveProps.isShowValidation = false;
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

    return arg;
  }

  public async changeMatchEvent(): Promise<void> {
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    this.logInfoEvent.matchId = this.eventLeagueComponent.selectedMatch?.matchId;
    
    await this.calculateOddsService.updateOddsInfo(this.logInfoEvent.filterWrongOdds, this.eventLeagueComponent.selectedMatch, this.filter?.subIssueTypeId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    this.updateMatchId.emit(this.logInfoEvent.matchId)
  }

  public resetLogInfoOfEvent(): void {
    this.primitiveProps.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
  }
}
