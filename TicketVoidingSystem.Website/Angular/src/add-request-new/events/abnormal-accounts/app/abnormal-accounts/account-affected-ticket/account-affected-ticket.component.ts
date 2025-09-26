import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import bigDecimal from 'js-big-decimal';
import * as _ from 'lodash';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { TicketTableComponent } from '../ticket-table/ticket-table.component';
import { TicketTableViewModel } from '../ticket-table/ticket-table.model';
import { AccountTableComponent } from '../account-table/account-table.component';
import { AccountAffectedTicketModel, AdjustedAccountModel, TicketAdjustedAccountModel } from './account-affected-ticket.model';

@Component({
  selector: 'account-affected-ticket',
  templateUrl: './account-affected-ticket.component.html',
  styleUrls: ['./account-affected-ticket.component.scss'],
  standalone: true,
  imports: [AccountTableComponent, TicketTableComponent]
})
export class AccountAffectedTicketComponent implements OnInit {
  @Input() model = new AccountAffectedTicketModel();
  @Input() tickets: TicketAdjustedAccountModel[];
  @Output() ticketsChange = new EventEmitter<TicketAdjustedAccountModel[]>();
  isBlock: boolean;
  isEdittedTicket: boolean;
  tempAdjustedAccounts = new AdjustedAccountModel();
  private readonly addRequestApiService = inject(AddRequestApiService);

  async ngOnInit() {
    this.isEdittedTicket = false;
    await this.updateTable();
  }

  async updateTable() {
    this.tempAdjustedAccounts.accountWinlostTables = [_.cloneDeep(this.model.accountWinlostModels.find(x => x.custId === Number(this.model.selectedCustId)))];
    if (this.model.adjustedAccounts.some(x => x.custId === Number(this.model.selectedCustId))) {
      const result = this.model.adjustedAccounts.find(x => x.custId === Number(this.model.selectedCustId)).ticketTableViewModel;
      this.tempAdjustedAccounts.ticketTableViewModel = new TicketTableViewModel(result);
    } else {
      await this.getTicketsAbnormalAccount();
    }
  }

  closeClick() {
    this.model.isOpen = false;
  }

  saveClick() {
    this.updateAdjustedAccounts(this.model.selectedCustId);
    this.updateValueToAccountTable();
    this.ticketsChange.emit(this.getAdjustedTickets());
    this.model.isOpen = false;
  }

  getAdjustedTickets() {
    return this.model.adjustedAccounts
      .flatMap(account =>
        account.ticketTableViewModel.groups.flatMap(group =>
          group.tickets.map(ticket => ({
            custId: account.custId,
            transId: ticket.betId,
            isChecked: ticket.isChecked,
          } as TicketAdjustedAccountModel))
        )
      );
  }

  reCalculateAccount(winlost: bigDecimal) {
    this.isEdittedTicket = true;
    this.tempAdjustedAccounts.accountWinlostTables[0].estimateVoidAmount
      = Number(new bigDecimal(this.tempAdjustedAccounts.accountWinlostTables[0].estimateVoidAmountUnEditableTickets).add(winlost).getValue());
    this.tempAdjustedAccounts.accountWinlostTables[0].winLostAfterVoid
      = Number(new bigDecimal(this.tempAdjustedAccounts.accountWinlostTables[0].currentLosing)
        .add(new bigDecimal(this.tempAdjustedAccounts.accountWinlostTables[0].currentWinning))
        .add(new bigDecimal(-this.tempAdjustedAccounts.accountWinlostTables[0].estimateVoidAmount))
        .getValue());
  }

  private updateValueToAccountTable() {
    const currentAccount = this.model.accountWinlostModels.find(x => x.custId === this.model.selectedCustId);
    currentAccount.estimateVoidAmount = this.tempAdjustedAccounts.accountWinlostTables[0].estimateVoidAmount;
    currentAccount.winLostAfterVoid = this.tempAdjustedAccounts.accountWinlostTables[0].winLostAfterVoid;
    currentAccount.isEditedTicket = this.tempAdjustedAccounts.accountWinlostTables[0].isEditedTicket;
  }

  private async getTicketsAbnormalAccount() {
    this.isBlock = true;
    const result = await this.addRequestApiService.GetTicketsAbnormalAccount(Number(this.model.selectedCustId), this.model.transInfoJson);
    this.tempAdjustedAccounts.ticketTableViewModel = new TicketTableViewModel(result);
    this.isBlock = false;
  }

  private updateAdjustedAccounts(custId: number) {
    if (!this.isEdittedTicket) {
      return;
    }

    if (this.model.adjustedAccounts.every(x => x.custId !== custId)) {
      this.model.adjustedAccounts.push({ custId: custId, ticketTableViewModel: this.tempAdjustedAccounts.ticketTableViewModel } as AdjustedAccountModel);
    } else {
      const account = this.model.adjustedAccounts.find(x => x.custId === custId);
      account.ticketTableViewModel = this.tempAdjustedAccounts.ticketTableViewModel;
    }
    this.tempAdjustedAccounts.accountWinlostTables[0].isEditedTicket = true;
    this.isEdittedTicket = false;
  }
}
