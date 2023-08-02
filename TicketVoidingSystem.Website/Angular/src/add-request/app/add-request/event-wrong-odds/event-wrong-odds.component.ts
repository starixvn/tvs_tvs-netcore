import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PoolHouseTicketValue } from '../../../../utility/constants/config';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { LeagueEventRedCardComponent } from '../event-red-card/league-event-red-card/league-event-red-card.component';
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
  @Input() issueTypeId: string;
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() wrongOddsModels: WrongOddsModel[] = [];
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('leagueEvent') leagueEventWrongOddsComponent: LeagueEventRedCardComponent;
  @ViewChild('filterWrongOdds') filterWrongOddsComponent: FilterWrongOddsComponent;
  logInfoEvent = new LogInfoWrongOdds();
  primitiveProps = new PrimitiveProperty();

  constructor(
    private readonly validationService: ValidationService,
    private readonly eventWrongOddsService: EventWrongOddsService,
    private readonly logInfoService: LogInfoService,
    private readonly addRequestStore: AddRequestStore,
    private readonly saveRequestService: SaveRequestService,
    private readonly addRequestApiService: AddRequestApiService

    ) { }

  ngOnInit(): void {
    if (this.isEdit) {
      this.logInfoEvent = this.eventWrongOddsService.assignModelsToEvents(this.wrongOddsModels[0]);
    } else {
      this.logInfoEvent = this.eventWrongOddsService.initDefaultLogInfoWrongOdds();
    }
  }

  public async clickSearch(): Promise<void> {
    this.logInfoEvent.poolHouseCheckedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
    await this.handleSearchEvent();
  }

  public async handleSearchEvent(): Promise<void> {
    this.primitiveProps.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);

    if (!this.validationService.validateCommonData(this.leagueEventWrongOddsComponent, this.filterWrongOddsComponent)) {
      return;
    }

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
    this.logInfoEvent.linkedLogsViewModel = await this.eventWrongOddsService.getLinkedLog(this.logInfoEvent, this.filter);
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
    arg.leagueEventWrongOddsComponent = this.leagueEventWrongOddsComponent;
    arg.logInfoEvent = this.logInfoEvent;
    arg.addRequestStore = this.addRequestStore;

    return arg;
  }

  public changeMatchEvent(): void {
    this.logInfoEvent.matchId = this.leagueEventWrongOddsComponent?.selectedMatch.matchId;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
    this.updateMatchId.emit(this.logInfoEvent.matchId);
  }

  public resetLogInfoOfEvent(): void {
    this.primitiveProps.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
  }
}
