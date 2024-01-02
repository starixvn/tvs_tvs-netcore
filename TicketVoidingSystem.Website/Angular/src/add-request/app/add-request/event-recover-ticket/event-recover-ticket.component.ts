import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BetIdsComponent } from 'src/utility/components/bet-ids/bet-ids.component';
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
  styleUrls: ['./event-recover-ticket.component.scss']
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
  ) { }

  ngOnInit(): void {
    this.recoverTicketModel.productIds = ProductFilterRecoverTicket.SELECTION_ITEMS[0].value;
  }

  async afterFocusOutBetIds(): Promise<void> {
    if (!this.isCancelAfterFocusOutBetIdsEvent) {
      this.primitiveProps.isBlockBetIds = true;
      await this.validationService.checkBusinessRule(this.betIdsComponent, this.recoverTicketModel, this.filter, this.requestId);
      this.primitiveProps.isBlockBetIds = false;
    }
  }

  public async saveRequest(): Promise<void> {
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