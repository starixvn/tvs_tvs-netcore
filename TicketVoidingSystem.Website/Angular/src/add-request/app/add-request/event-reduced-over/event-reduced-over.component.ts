import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { OddsInfo } from '../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { AddRequestStore } from '../add-request.store';
import { LeagueEventRedCardComponent } from '../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../filter/filter.model';
import { ReducedOverModel } from '../models/event-reduced-over.model';
import { OthersModel } from '../others/others.model';
import { FilterReducedOverComponent } from './filter-reduced-over/filter-reduced-over.component';
import { ReducedOverBetType } from './models/bet-type-reduced-over-json.model';
import { LogInfoReducedOver } from './models/log-info-reduced-over.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { EventReducedOverService } from './services/event-reduced-over.service';
import { FilterReducedOverService } from './services/filter-reduced-over.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-reduced-over',
  templateUrl: './event-reduced-over.component.html',
  styleUrls: ['./event-reduced-over.component.scss']
})
export class EventReducedOverComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() reducedOverModels: ReducedOverModel[] = [];
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('leagueEvent') leagueEventReducedOverComponent: LeagueEventRedCardComponent;
  @ViewChild('filterReducedOver') filterReducedOverComponent: FilterReducedOverComponent;

  logInfoEvent = new LogInfoReducedOver();
  primitivePropertyEvent = new PrimitivePropertyEvent();
  originalReducedOverBetTypes: ReducedOverBetType[];
  originalPlayers: OddsInfo[];
  groupReducedOverBetTypes: ReducedOverBetType[];

  constructor(
    private readonly validationService: ValidationService,
    private readonly addRequestStore: AddRequestStore,
    private readonly logInfoService: LogInfoService,
    private readonly saveRequestService: SaveRequestService,
    private readonly eventReducedOverService: EventReducedOverService,
    private readonly filterService: FilterReducedOverService
    ) { }

  async ngOnInit(): Promise<void> {
    if (this.isEdit) {
      this.logInfoEvent = this.eventReducedOverService.assignModelsToEvents(this.reducedOverModels);
      await this.updateModelWhenChangeMatchId();
      this.logInfoEvent.filterReducedOvers.forEach(x => {
        x.betTypeNgSelectMixtureModel = this.filterService.initBetTypeNgSelectMixtureModel(this.groupReducedOverBetTypes);
        x.playerMultipleSelection = this.filterService.initDefaultPlayerSelection();
      });
      this.primitivePropertyEvent.isShowFilterArea = true;
      this.primitivePropertyEvent.isShowValidation = true;
    }
  }

  private async updateModelWhenChangeMatchId(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.originalReducedOverBetTypes = await this.filterService.getReducedOverBetTypes(this.logInfoEvent.matchId);
    this.originalPlayers = await this.filterService.getPlayers(this.logInfoEvent.matchId, this.originalReducedOverBetTypes.map(x => x.betTypeId).join(','));
    this.groupReducedOverBetTypes = this.filterService.renderGroupReducedOverBetTypes(this.originalReducedOverBetTypes);
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  public async clickSearch(): Promise<void> {
    this.primitivePropertyEvent.isShowValidation = false;
    if (!this.validationService.validateCommonData(this.leagueEventReducedOverComponent, this.filterReducedOverComponent)) {
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
    arg.filterReducedOverComponent = this.filterReducedOverComponent;
    arg.leagueEventReducedOverComponent = this.leagueEventReducedOverComponent;
    arg.logInfoEvent = this.logInfoEvent;
    arg.addRequestStore = this.addRequestStore;

    return arg;
  }

  public async changeMatchEvent(): Promise<void> {
    this.primitivePropertyEvent.isShowFilterArea = false;
    this.primitivePropertyEvent.isShowValidation = false;
    this.updateMatchId.emit(this.logInfoEvent.matchId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);

    if (this.leagueEventReducedOverComponent?.selectedMatch.matchId) {
      this.logInfoEvent.matchId = this.leagueEventReducedOverComponent.selectedMatch.matchId;
      await this.updateModelWhenChangeMatchId();
      this.resetFilterReducedOver();
      this.primitivePropertyEvent.isShowFilterArea = true;
    }
  }

  public resetLogInfoOfEvent(): void {
    this.primitivePropertyEvent.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
  }

  public resetFilterReducedOver(): void {
    this.logInfoEvent.filterReducedOvers = [];
    this.initDefaultFilterReducedItem();
  }

  private initDefaultFilterReducedItem(): void {
    this.logInfoEvent.filterReducedOvers.push(this.filterService.initDefaultFilter(this.groupReducedOverBetTypes));
  }
}
