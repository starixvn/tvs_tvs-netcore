import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import bigDecimal from 'js-big-decimal';
import * as _ from 'lodash';
import { AddRequestApiService } from '../../add-request-api.service';
import { TicketTableViewModel } from '../../components/ticket-table/ticket-table.model';
import { AccountAffectedTicketModel, AdjustedAccountModel, TicketAdjustedAccountModel } from './account-affected-ticket.model';

@Component({
  selector: 'account-affected-ticket',
  templateUrl: './account-affected-ticket.component.html',
  styleUrls: ['./account-affected-ticket.component.scss']
})
export class AccountAffectedTicketComponent implements OnInit {
  @Input() model = new AccountAffectedTicketModel();
  @Input() tickets: TicketAdjustedAccountModel[];
  @Output() ticketsChange = new EventEmitter<TicketAdjustedAccountModel[]>();
  isBlock: boolean;
  isEdittedTicket: boolean;
  previousCustId: string;
  tempAdjustedAccounts = new AdjustedAccountModel();
  constructor(private readonly addRequestApiService: AddRequestApiService) { }

  async ngOnInit() {
    this.isEdittedTicket = false;
    this.previousCustId = this.model.selectedCustId;
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

  async onChangeUsername() {
    this.updateAdjustedAccounts();
    await this.updateTable();
    this.previousCustId = this.model.selectedCustId;
  }

  closeClick() {
    this.model.isOpen = false;
  }

  saveClick() {
    this.updateAdjustedAccounts();
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
    this.model.adjustedAccounts.forEach(item => {
      const currentAccount = this.model.accountWinlostModels.find(x => x.custId === Number(item.custId));
      currentAccount.estimateVoidAmount = this.tempAdjustedAccounts.accountWinlostTables[0].estimateVoidAmount;
      currentAccount.winLostAfterVoid = this.tempAdjustedAccounts.accountWinlostTables[0].winLostAfterVoid;
      currentAccount.isEditedTicket = this.tempAdjustedAccounts.accountWinlostTables[0].isEditedTicket;
    });
  }

  private async getTicketsAbnormalAccount() {
    this.isBlock = true;
    const result = await this.addRequestApiService.GetTicketsAbnormalAccount(Number(this.model.selectedCustId), this.model.transInfoJson);
    this.tempAdjustedAccounts.ticketTableViewModel = new TicketTableViewModel(result);
    this.isBlock = false;
  }

  private updateAdjustedAccounts() {
    if (!this.isEdittedTicket) {
      return;
    }

    const previousCustId = Number(this.previousCustId);
    if (this.model.adjustedAccounts.every(x => x.custId !== previousCustId)) {
      this.model.adjustedAccounts.push({ custId: previousCustId, ticketTableViewModel: this.tempAdjustedAccounts.ticketTableViewModel } as AdjustedAccountModel);
    } else {
      const index = this.model.adjustedAccounts.findIndex(x => x.custId === previousCustId);
      this.model.adjustedAccounts[index].ticketTableViewModel = this.tempAdjustedAccounts.ticketTableViewModel;
    }
    this.tempAdjustedAccounts.accountWinlostTables[0].isEditedTicket = true;
    this.isEdittedTicket = false;
  }
}
