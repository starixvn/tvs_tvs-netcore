import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddRequestApiService } from '../../add-request-api.service';
import { TicketTableModel, TicketTableViewModel } from '../../components/ticket-table/ticket-table.model';
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
  //accountWinlostTables: AccountWinlostModel[] = [];
  //ticketTableViewModel = new TicketTableViewModel();
  tempAdjustedAccounts = new AdjustedAccountModel();
  constructor(private readonly addRequestApiService: AddRequestApiService) { }

  async ngOnInit() {
    this.isEdittedTicket = false;
    this.previousCustId = this.model.selectedCustId;
    await this.updateTable();
  }

  async updateTable() {
    if (this.model.adjustedAccounts.some(x => x.custId === Number(this.model.selectedCustId))) {
      const result = this.model.adjustedAccounts.find(x => x.custId === Number(this.model.selectedCustId)).ticketTableViewModel;
      this.tempAdjustedAccounts.ticketTableViewModel = new TicketTableViewModel(result);
    } else {
      await this.getTicketsAbnormalAccount();
    }
    this.tempAdjustedAccounts.accountWinlostTables = [this.model.accountWinlostModels.find(x => x.custId === Number(this.model.selectedCustId))];
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

  handleChangeTicket(ticket: TicketTableModel) {
    const adjustment = BigInt(ticket.isChecked ? this.convertStringWithCommaToNumber(ticket.winLoss) : -this.convertStringWithCommaToNumber(ticket.winLoss));
    this.reCalculateAccount(adjustment);
  }

  handleChangeGroup(groupId: number) {
    const group = this.tempAdjustedAccounts.ticketTableViewModel.groups.find(x => x.id === groupId);
    const totalWinLoss = group.tickets.reduce((acc, ticket) => acc + BigInt(this.convertStringWithCommaToNumber(ticket.winLoss)), BigInt(0));
    const adjustment = BigInt(group.isChecked ? totalWinLoss : -totalWinLoss);
    this.reCalculateAccount(adjustment);
  }

  handleChangeGroupTicketTable() {
    const totalWinLoss = this.tempAdjustedAccounts.ticketTableViewModel.groups
      .flatMap(group => group.tickets)
      .reduce((acc, ticket) => acc + BigInt(this.convertStringWithCommaToNumber(ticket.winLoss)), BigInt(0));

    const adjustment = BigInt(this.tempAdjustedAccounts.ticketTableViewModel.isChecked ? totalWinLoss : -totalWinLoss);
    this.reCalculateAccount(adjustment);
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
    this.isEdittedTicket = false;
  }

  private reCalculateAccount(winlost: bigint) {
    this.isEdittedTicket = true;
    this.tempAdjustedAccounts.accountWinlostTables[0].estimateVoidAmount
      = Number(BigInt(this.tempAdjustedAccounts.accountWinlostTables[0].estimateVoidAmount) + winlost);
    this.tempAdjustedAccounts.accountWinlostTables[0].winLostAfterVoid
      = Number(BigInt(this.tempAdjustedAccounts.accountWinlostTables[0].currentLosing)
        + BigInt(this.tempAdjustedAccounts.accountWinlostTables[0].currentWinning) - BigInt(this.tempAdjustedAccounts.accountWinlostTables[0].estimateVoidAmount));
  }

  private convertStringWithCommaToNumber(value: string): number {
    return parseInt(value.replace(/,/g, ''), 10);
  }
}
