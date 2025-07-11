import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { BlockUiDirective } from '../../../../utility/components/block-ui/block-ui.directive';
import { TooltipComponent } from '../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../../utility/constants/text';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { RecoverTicketModel } from '../models/recover-ticket.model';
import { OthersModel } from '../others/others.model';
import { ProductFilterRecoverTicket } from './constants/product.constant';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-recover-ticket',
  templateUrl: './event-recover-ticket.component.html',
  styleUrls: ['./event-recover-ticket.component.scss'],
  standalone: true,
  imports: [BetIdsComponent, NgSelectModule, FormsModule, CommonModule, BlockUiDirective, TooltipComponent],
  providers: [SaveRequestService, ValidationService]
})
export class EventRecoverTicketComponent implements OnInit {
  @Input() recoverTicketModel = new RecoverTicketModel();
  @Input() filter: FilterModel;
  @Input() isEdit: boolean;
  @Input() requestId?: number;
  @Input() others = new OthersModel();
  @ViewChild('betIds') betIdsComponent: BetIdsComponent;

  primitiveProps = new PrimitiveProperty();
  isCancelAfterFocusOutBetIdsEvent = false;
  isSubParlay = false;
  products = ProductFilterRecoverTicket.SELECTION_ITEMS;
  tooltip = new Tooltip();

  constructor() {
    this.tooltip.element = this.element;
  }

  private readonly element = inject(ElementRef);
  private readonly commonService = inject(CommonService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly validationService = inject(ValidationService);
  private readonly addRequestApiService = inject(AddRequestApiService);

  async ngOnInit() {
    this.isSubParlay = this.recoverTicketModel.filterBy === 1;
    this.recoverTicketModel.productIds = ProductFilterRecoverTicket.SELECTION_ITEMS[0].value;
    this.primitiveProps.permission = await this.addRequestApiService.getPermissionAddRequest();
  }

  async afterFocusOutBetIds() {
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    if (!this.isCancelAfterFocusOutBetIdsEvent) {
      this.primitiveProps.isBlockBetIds = true;
      await this.validationService.checkBusinessRule(this.betIdsComponent, this.recoverTicketModel, this.requestId,
        this.primitiveProps, this.tooltip);
      this.primitiveProps.isBlockBetIds = false;
    }
  }

  changeSubParlay() {
    this.recoverTicketModel.filterBy = this.isSubParlay ? 1 : null;
  }

  async saveRequest() {
    this.isCancelAfterFocusOutBetIdsEvent = true;
    this.betIdsComponent.triggerFocusOutBetIds();
    this.isCancelAfterFocusOutBetIdsEvent = false;
    this.saveRequestService.saveRequest(this.createSaveRequestArg());
  }

  async onBlurMatchId() {
    const result = await this.commonService.getMatchInfoAddRequestTvs(this.recoverTicketModel.matchId, this.recoverTicketModel.productIds);
    if (result.errorCode === 0) {
      this.primitiveProps.isMatchIdValid = true;
      return;
    }
    this.primitiveProps.isMatchIdValid = false;
    this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
  }

  private createSaveRequestArg(): SaveRequestArg {
    const args = new SaveRequestArg();
    args.primitiveProps = this.primitiveProps;
    args.requestId = this.requestId;
    args.isEdit = this.isEdit;
    args.filter = this.filter;
    args.recoverTicketModel = this.createRecoverTicketModel();
    args.betIdsComponent = this.betIdsComponent;
    args.others = this.others;
    args.addRequestStore = this.addRequestStore;
    args.tooltip = this.tooltip;

    return args;
  }

  private createRecoverTicketModel(): RecoverTicketModel {
    return {
      transIds: this.betIdsComponent.getAllBetIds(),
      productIds: this.recoverTicketModel.productIds,
      filterBy: this.recoverTicketModel.filterBy,
      matchId: this.recoverTicketModel.matchId,
      subIssueTypeId: Number(this.filter.subIssueTypeId)
    } as RecoverTicketModel;
  }
}