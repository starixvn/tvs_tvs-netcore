import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmAbnormalBetModel } from './confirm-abnormal-bet.model';

@Component({
    selector: 'confirm-abnormal-bet',
    templateUrl: './confirm-abnormal-bet.component.html',
    styleUrls: ['./confirm-abnormal-bet.component.scss'],
    standalone: true,
    imports: [FormsModule]
})
export class ConfirmAbnormalBetComponent implements OnChanges {
  @Input() model = new ConfirmAbnormalBetModel();
  @Input() isEdit: boolean;
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  ticketsOfVIPCustomer: string;
  settledTickets: string;
  ticketsOfCustomerClass201: string;
  ticketsOfCustomerClass4K: string;
  isRemoveCustomerClass201 = true;
  isRemoveCustomerClass4K = true;
  isShowErrorCannotRemoveAllTickets = false;
  isCanNotSelectedRemoveTicketCC201 = false;
  isCanNotSelectedRemoveTicketCC4K = false;
  isConfirmCalculator = true;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && this.model.isOpenDialog) {
      this.updateData();
    }
  }

  private updateData(): void {
    if (this.model.isHasWarningForAbnormalBet) {
      this.ticketsOfVIPCustomer = this.model.ticketsOfVIPCustomer.replaceAll(',', ', ');
      this.settledTickets = this.model.settledTickets.replaceAll(',', ', ');
      this.ticketsOfCustomerClass201 = this.model.ticketsOfCustomerClass201.replaceAll(',', ', ');
      this.ticketsOfCustomerClass4K = this.model.ticketsOfCustomerClass4K.replaceAll(',', ', ');

      this.updateRemoveCustomerClassStatus();
    }
  }

  private updateRemoveCustomerClassStatus() {
    const transIdList = this.model.transIds.split(',');
    const ticketsOfCustomerClass201List = this.model.ticketsOfCustomerClass201.split(',');
    const ticketsOfCustomerClass4KList = this.model.ticketsOfCustomerClass4K.split(',');
    const ticketsOfCustomerClass201And4KList = [...ticketsOfCustomerClass201List, ...ticketsOfCustomerClass4KList].filter(x => x !== '');

    if (this.isAllTicketsOfCustomerClass(transIdList, ticketsOfCustomerClass201List)) {
      this.isRemoveCustomerClass201 = false;
      this.isCanNotSelectedRemoveTicketCC201 = true;
      this.isShowErrorCannotRemoveAllTickets = true;
      return;
    }

    if (this.isAllTicketsOfCustomerClass(transIdList, ticketsOfCustomerClass4KList)) {
      this.isRemoveCustomerClass4K = false;
      this.isCanNotSelectedRemoveTicketCC4K = true;
      this.isShowErrorCannotRemoveAllTickets = true;
      return;
    }

    if (this.isAllTicketsOfCustomerClass(transIdList, ticketsOfCustomerClass201And4KList)) {
      this.isRemoveCustomerClass201 = false;
      this.isRemoveCustomerClass4K = false;
      this.isCanNotSelectedRemoveTicketCC201 = false;
      this.isCanNotSelectedRemoveTicketCC4K = false;
      this.isShowErrorCannotRemoveAllTickets = true;
    }
  }

  checkRemoveCC201() {
    if (this.isShowErrorCannotRemoveAllTickets) {
      this.isCanNotSelectedRemoveTicketCC4K = !this.isCanNotSelectedRemoveTicketCC4K;
    }
  }

  checkRemoveCC4K() {
    if (this.isShowErrorCannotRemoveAllTickets) {
      this.isCanNotSelectedRemoveTicketCC201 = !this.isCanNotSelectedRemoveTicketCC201;
    }
  }

  private isAllTicketsOfCustomerClass(transIdList: string[], ticketsList: string[]): boolean {
    if (transIdList.filter(x => !ticketsList?.includes(x)).length > 0) {
      return false;
    }
    return true;
  }

  closeClick() {
    this.model.isOpenDialog = false;
    this.isRemoveCustomerClass201 = true;
    this.isRemoveCustomerClass4K = true;
    this.isShowErrorCannotRemoveAllTickets = false;
    this.isCanNotSelectedRemoveTicketCC201 = false;
    this.isCanNotSelectedRemoveTicketCC4K = false;
    this.close.emit();
  }

  saveClick() {
    this.model.isOpenDialog = false;
    this.save.emit();
  }
}
