import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { ProductFilter, TVSRequestActionType, TicketStatus } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() isDisabled: boolean;
  @Input() actionId: string;
  @Input() abnormalAccountModel: AbnormalAccountModel;
  @Output() changeFilterEvent = new EventEmitter();

  products = ProductFilter.SELECTION_ITEMS;
  ticketStatus = TicketStatus.SELECTION_ITEMS;
  tooltip = new Tooltip();
  selectedProducts: string[] = [];
  selectedTicketStatus: string[] = [];

  private readonly PRODUCT_CLASS = 'product';
  private readonly TICKET_STATUS_CLASS = 'ticket-status';

  constructor(
    private readonly element: ElementRef,
  ) {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
    this.updateItem();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['actionId']) {
      this.selectedTicketStatus = this.actionId === TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString()
        ? TicketStatus.SELECTION_ITEMS_AUTO_VOID_POLICY.map(x => x.value)
        : TicketStatus.SELECTION_ITEMS.map(x => x.value);
      this.changeFilterEvent.emit();
    }
  }

  isValidComponent(): boolean {
    if (this.selectedProducts.length === 0 ) {
      this.tooltip.display(this.PRODUCT_CLASS, LABELS.REQUIRED_PRODUCT);
      return false;
    } else {
      this.abnormalAccountModel.productIds = this.selectedProducts.join(',');
    }

    if (this.selectedTicketStatus.length === 0 ) {
      this.tooltip.display(this.TICKET_STATUS_CLASS, LABELS.REQUIRED_TICKET_STATUS);
      return false;
    } else {
      this.abnormalAccountModel.statusIds = this.selectedTicketStatus.join(',');
    }

    return true ;
  }

  updateItem() {
    const STATUS_RUNNING = '0';
    const STATUS_WAITING = '1';

    const productValues = this.isEdit ? this.abnormalAccountModel.productIds.split(',') : this.products.map(x => x.value).join(',');
    let ticketStatusValues = this.isEdit ? this.abnormalAccountModel.statusIds.split(',') : this.ticketStatus.map(x => x.value);
    if (ticketStatusValues.includes(STATUS_RUNNING) && ticketStatusValues.includes(STATUS_WAITING)) {
      ticketStatusValues = ticketStatusValues.filter(x => x !== STATUS_RUNNING && x !== STATUS_WAITING);
      ticketStatusValues.push(`${STATUS_RUNNING},${STATUS_WAITING}`);
    }

    this.selectedProducts = ProductFilter.SELECTION_ITEMS.filter( x => productValues.includes(x.value.toString())).map(x => x.value);
    this.selectedTicketStatus = TicketStatus.SELECTION_ITEMS.filter(x => ticketStatusValues.includes(x.value.toString())).map(x => x.value);
  }

  changeFilter(): void {
    this.changeFilterEvent.emit();
  }
}
