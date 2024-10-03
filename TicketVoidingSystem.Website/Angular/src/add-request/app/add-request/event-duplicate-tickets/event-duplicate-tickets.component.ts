import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { AbnormalFilterBy, MatchIdConstant, TVSRequestActionType } from '../../../../utility/constants/config';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { DuplicateTicketsModel } from '../models/event-duplicate-tickets.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { OthersModel } from '../others/others.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';

@Component({
  selector: 'event-duplicate-tickets',
  templateUrl: './event-duplicate-tickets.component.html',
  styleUrls: ['./event-duplicate-tickets.component.scss']
})
export class EventDuplicateTicketsComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() requestId?: number;
  @Input() filter = new FilterModel();
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() duplicateTicketsModel = new DuplicateTicketsModel();
  @Output() updateMatchId = new EventEmitter<number>();
  @ViewChild('betIds') betIdsComponent: BetIdsComponent;
  @ViewChild('leagueEvent') eventLeagueComponent: EventLeagueComponent;

  primitiveProps = new PrimitiveProperty();
  permission = new PermissionAddRequest();
  isCancelAfterFocusOutBetIdsEvent = false;
  abnormalFilterBy = new AbnormalFilterBy();
  tooltip = new Tooltip();
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService,
    private readonly saveRequestService: SaveRequestService,
    private readonly addRequestStore: AddRequestStore,
    private readonly element: ElementRef
    ) {
      this.tooltip.element = this.element;
    }

  async ngOnInit(): Promise<void> {
    if (!this.isEdit) {
      this.duplicateTicketsModel.filterBy = AbnormalFilterBy.SINGLE;
    }
    this.addRequestStore.changeAbnormalFilterBy(this.duplicateTicketsModel.filterBy);
    this.permission = await this.addRequestApiService.getPermissionAddRequest();
  }

  async afterFocusOutBetIds(): Promise<void> {
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    if (!this.isCancelAfterFocusOutBetIdsEvent) {
      this.primitiveProps.isBlockBetIds = true;
      await this.checkValidBusinessRule();
      this.primitiveProps.isBlockBetIds = false;
    }
  }

  async saveRequest(): Promise<void> {
    this.isCancelAfterFocusOutBetIdsEvent = true;
    this.betIdsComponent.triggerFocusOutBetIds();
    this.isCancelAfterFocusOutBetIdsEvent = false;
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
  }

  public removeInvalidTransIds(): void {
    this.betIdsComponent.removeTransId(this.primitiveProps.invalidTransIds);
    this.primitiveProps.isShowButtonRemoveInvalid = false;
  }

  public triggerCloseEvent() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public changeFilterBy(filterBy: number) {
    this.duplicateTicketsModel.filterBy = filterBy;
    this.addRequestStore.changeAbnormalFilterBy(filterBy);
  }

  private initSaveRequestInput(): SaveRequestArg {
    const args: SaveRequestArg = {
      requestId: this.requestId,
      isEdit: this.isEdit,
      actionIdOfFirstTimeAccess: this.actionIdOfFirstTimeAccess,
      filter: this.filter,
      permission: this.permission,
      primitiveProps: this.primitiveProps,
      duplicateTicketsModel: this.createDuplicateTicketsModel(),
      others: this.others,
      betIdsComponent: this.betIdsComponent,
      eventLeagueComponent: this.eventLeagueComponent,
      addRequestStore: this.addRequestStore,
      tooltip: this.tooltip
    };

    return args;
  }

  private async checkValidBusinessRule(): Promise<boolean> {
    const validation = await this.validationService.checkValidBusinessRule(this.initSaveRequestInput());
    if (this.duplicateTicketsModel.filterBy === AbnormalFilterBy.SINGLE) {
      this.updateMatchId.emit(this.eventLeagueComponent.selectedMatch.matchId);
    }
    return validation;
  }

  public isShowLeagueEvent(): boolean {
    return this.duplicateTicketsModel.filterBy === AbnormalFilterBy.SINGLE;
  }

  public isDisableBetIds(): boolean {
    return this.filter.isVoided || this.filter.action === TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString();
  }

  private createDuplicateTicketsModel(): DuplicateTicketsModel {
    const model = new DuplicateTicketsModel();
    model.matchId = this.validationService.isFilterMixParlay(this.duplicateTicketsModel.filterBy) ? MatchIdConstant.Parlay : this.eventLeagueComponent.selectedMatch.matchId;
    model.transIds = this.betIdsComponent.getAllBetIds();
    model.subIssueTypeId = Number(this.filter.subIssueTypeId);
    model.filterBy = this.duplicateTicketsModel.filterBy;
    model.orgTransIds = this.duplicateTicketsModel.orgTransIds?.replace(/\n/g, ',')

    return model;
  }
}
