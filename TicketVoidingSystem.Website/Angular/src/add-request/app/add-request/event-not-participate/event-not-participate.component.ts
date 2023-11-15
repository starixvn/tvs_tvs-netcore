import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AddRequestStore } from '../add-request.store';
import { LeagueEventRedCardComponent } from '../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../filter/filter.model';
import { NotParticipateModel } from '../models/event-not-participate.model';
import { OthersModel } from '../others/others.model';
import { FilterNotParticipateComponent } from './filter-not-participate/filter-not-participate.component';
import { LogInfoNotParticipate } from './models/log-info-not-participate.model';
import { Player } from './models/player.model';
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
  styleUrls: ['./event-not-participate.component.scss']
})
export class EventNotParticipateComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() requestId: number;
  @Input() filter: FilterModel;
  @Input() issueTypeId: string;
  @Input() notParticipateModels: NotParticipateModel[] = [];
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('leagueEvent') leagueEventNotParticipateComponent: LeagueEventRedCardComponent;
  @ViewChild('filterNotParticipate') filterNotParticipateComponent: FilterNotParticipateComponent;

  logInfoEvent = new LogInfoNotParticipate();
  primitivePropertyEvent = new PrimitivePropertyEvent();
  originalPlayers: Player[];

  constructor(
    private readonly validationService: ValidationService,
    private readonly addRequestStore: AddRequestStore,
    private readonly logInfoService: LogInfoService,
    private readonly saveRequestService: SaveRequestService,
    private readonly eventNotParticipateService: EventNotParticipateService,
    private readonly filterService: FilterNotParticipateService
    ) { }

  async ngOnInit(): Promise<void> {
    if (this.isEdit) {
      this.logInfoEvent = this.eventNotParticipateService.assignModelsToEvents(this.notParticipateModels);
      await this.updateModelWhenChangeMatchId();
      this.primitivePropertyEvent.isShowFilterArea = true;
      this.primitivePropertyEvent.isShowValidation = true;
    }
  }

  private async updateModelWhenChangeMatchId(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.originalPlayers = await this.filterService.getPlayers(this.logInfoEvent.matchId);
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  public async clickSearch(): Promise<void> {
    this.primitivePropertyEvent.isShowValidation = false;
    if (!this.validationService.validateCommonData(this.leagueEventNotParticipateComponent, this.filterNotParticipateComponent)) {
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
    arg.leagueEventNotParticipateComponent = this.leagueEventNotParticipateComponent;
    arg.logInfoEvent = this.logInfoEvent;
    arg.addRequestStore = this.addRequestStore;

    return arg;
  }

  public async changeMatchEvent(): Promise<void> {
    this.primitivePropertyEvent.isShowFilterArea = false;
    this.primitivePropertyEvent.isShowValidation = false;
    this.updateMatchId.emit(this.logInfoEvent.matchId);
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);

    if (this.leagueEventNotParticipateComponent?.selectedMatch.matchId) {
      this.logInfoEvent.matchId = this.leagueEventNotParticipateComponent.selectedMatch.matchId;
      await this.updateModelWhenChangeMatchId();
      this.resetFilterNotParticipate();
      this.primitivePropertyEvent.isShowFilterArea = true;
    }
  }

  public resetLogInfoOfEvent(): void {
    this.primitivePropertyEvent.isShowValidation = false;
    this.logInfoService.resetLogInfoOfEvent(this.logInfoEvent);
  }

  public resetFilterNotParticipate(): void {
    this.logInfoEvent.filterNotParticipates = [];
    this.initDefaultFilterReducedItem();
  }

  private initDefaultFilterReducedItem(): void {
    this.logInfoEvent.filterNotParticipates.push(this.filterService.initDefaultFilter());
  }
}
