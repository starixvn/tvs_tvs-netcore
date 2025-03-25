import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUiModule } from 'src/utility/components/block-ui/block-ui.module';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
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
    imports: [BetIdsComponent, NgSelectModule, FormsModule, CommonModule, BlockUiModule]
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
  products = ProductFilterRecoverTicket.SELECTION_ITEMS;

  constructor(
    private readonly addRequestStore: AddRequestStore,
    private readonly saveRequestService: SaveRequestService,
    private readonly validationService: ValidationService,
    private readonly addRequestApiService: AddRequestApiService
  ) { }

  async ngOnInit(): Promise<void> {
    this.recoverTicketModel.productIds = ProductFilterRecoverTicket.SELECTION_ITEMS[0].value;
    this.primitiveProps.permission = await this.addRequestApiService.getPermissionAddRequest();
  }

  async afterFocusOutBetIds(): Promise<void> {
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    if (!this.isCancelAfterFocusOutBetIdsEvent) {
      this.primitiveProps.isBlockBetIds = true;
      await this.validationService.checkBusinessRule(this.betIdsComponent, this.recoverTicketModel, this.filter, this.requestId, this.primitiveProps.permission);
      this.primitiveProps.isBlockBetIds = false;
    }
  }

  public async saveRequest(): Promise<void> {
    this.isCancelAfterFocusOutBetIdsEvent = true;
    this.betIdsComponent.triggerFocusOutBetIds();
    this.isCancelAfterFocusOutBetIdsEvent = false;
    this.saveRequestService.saveRequest(this.createSaveRequestArg());
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

    return args;
  }

  private createRecoverTicketModel(): RecoverTicketModel {
    return {
      transIds: this.betIdsComponent.getAllBetIds(),
      productIds: this.recoverTicketModel.productIds,
      filterBy: null,
      subIssueTypeId: Number(this.filter.subIssueTypeId)
    } as RecoverTicketModel;
  }
}