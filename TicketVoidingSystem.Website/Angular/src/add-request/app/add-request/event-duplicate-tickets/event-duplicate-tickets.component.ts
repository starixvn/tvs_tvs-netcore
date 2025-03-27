import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlockUiModule } from 'src/utility/components/block-ui/block-ui.module';
import { TooltipComponent } from 'src/utility/components/tooltip/tooltip.component';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { AbnormalFilterBy, MatchIdConstant, TVSRequestActionType } from '../../../../utility/constants/config';
import { CommonService } from '../../../../utility/services/common.service';
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

@Component({
  selector: 'event-duplicate-tickets',
  templateUrl: './event-duplicate-tickets.component.html',
  styleUrls: ['./event-duplicate-tickets.component.scss'],
  standalone: true,
  imports: [FormsModule, BlockUiModule, CommonModule, BetIdsComponent, TooltipComponent],
  providers: [ValidationService, SaveRequestService]
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

  primitiveProps = new PrimitiveProperty();
  permission = new PermissionAddRequest();
  isCancelAfterFocusOutBetIdsEvent = false;
  abnormalFilterBy = new AbnormalFilterBy();
  tooltip = new Tooltip();
  private readonly element = inject(ElementRef);
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly validationService = inject(ValidationService);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly commonService = inject(CommonService);

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit(): Promise<void> {
    if (this.isEdit) {
      const viewModel = await this.commonService.getMatchInfoAddRequest(this.duplicateTicketsModel.matchId, this.duplicateTicketsModel.sportType);
      this.duplicateTicketsModel.leagueName = viewModel.match.leagueName;
      this.duplicateTicketsModel.name = viewModel.match.name;
    }
    else {
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
      addRequestStore: this.addRequestStore,
      tooltip: this.tooltip
    };

    return args;
  }

  private async checkValidBusinessRule(): Promise<boolean> {
    let args = this.initSaveRequestInput();
    const validation = await this.validationService.checkValidBusinessRule(args);
    if (this.duplicateTicketsModel.filterBy === AbnormalFilterBy.SINGLE) {
      this.duplicateTicketsModel.name = args.duplicateTicketsModel.name;
      this.duplicateTicketsModel.leagueName = args.duplicateTicketsModel.leagueName;
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
    model.matchId = this.validationService.isFilterMixParlay(this.duplicateTicketsModel.filterBy) ? MatchIdConstant.Parlay : this.duplicateTicketsModel.matchId;
    model.transIds = this.betIdsComponent.getAllBetIds();
    model.subIssueTypeId = Number(this.filter.subIssueTypeId);
    model.filterBy = this.duplicateTicketsModel.filterBy;
    model.orgTransIds = this.duplicateTicketsModel.orgTransIds?.replace(/\n/g, ',')

    return model;
  }
}
