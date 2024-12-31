import { Component, Input, OnInit } from '@angular/core';
import { AddRequestApiService } from '../../add-request-api.service';
import { TicketTableModel, TicketTableViewModel } from '../../components/ticket-table/ticket-table.model';
import { AccountWinlostModel } from '../models/account-winlost.model';
import { AccountAffectedTicketModel, AdjustedAccountModel } from './account-affected-ticket.model';

@Component({
  selector: 'account-affected-ticket',
  templateUrl: './account-affected-ticket.component.html',
  styleUrls: ['./account-affected-ticket.component.scss']
})
export class AccountAffectedTicketComponent implements OnInit {
  @Input() model = new AccountAffectedTicketModel();
  //@Output() saveEventOutput = new EventEmitter<PoolHouseTicketsModel>();
  isBlock: boolean;
  accountWinlostTable: AccountWinlostModel;
  ticketTableViewModel = new TicketTableViewModel();
  adjustedAccounts: AdjustedAccountModel[] = [];
  constructor(private readonly addRequestApiService: AddRequestApiService) { }

  async ngOnInit() {
    await this.updateTable();
  }

  async updateTable() {
    this.isBlock = true;
    this.accountWinlostTable = this.model.accountWinlostModels.find(x => x.custId === Number(this.model.selectedCustId));
    const result = await this.addRequestApiService.GetTicketsAbnormalAccount(Number(this.model.selectedCustId), this.model.transInfoJson);
    this.ticketTableViewModel = new TicketTableViewModel(result);
    this.isBlock = false;
  }

  closeClick() {
    this.model.isOpen = false;
  }

  saveClick() {
    this.model.isOpen = false;

    //this.saveEventOutput.emit(this.model);
  }

  onChangeUsername() {
    this.updateTable();
  }

  handleChangeTicket(ticket: TicketTableModel) {
    const adjustment = BigInt(ticket.isChecked ? this.convertStringWithCommaToNumber(ticket.winLoss) : -this.convertStringWithCommaToNumber(ticket.winLoss));
    this.reCalculateAccount(adjustment);
  }

  handleChangeGroup(groupId: number) {
    const group = this.ticketTableViewModel.groups.find(x => x.id === groupId);
    const totalWinLoss = group.tickets.reduce((acc, ticket) => acc + BigInt(this.convertStringWithCommaToNumber(ticket.winLoss)), BigInt(0));
    const adjustment = BigInt(group.isChecked ? totalWinLoss : -totalWinLoss);
    this.reCalculateAccount(adjustment);
  }

  handleChangeGroupTicketTable() {
    const totalWinLoss = this.ticketTableViewModel.groups
      .flatMap(group => group.tickets)
      .reduce((acc, ticket) => acc + BigInt(this.convertStringWithCommaToNumber(ticket.winLoss)), BigInt(0));

    const adjustment = BigInt(this.ticketTableViewModel.isChecked ? totalWinLoss : -totalWinLoss);
    this.reCalculateAccount(adjustment);
  }

  private updateAdjustedAccounts() {
    if (this.adjustedAccounts.every(x => x.custId !== this.accountWinlostTable.custId)) {
      const ticketsByCurrentAccount = this.ticketTableViewModel.groups.flatMap(group => group.tickets).map(ticket => this.convertToAdjustedAccount(ticket));
      this.adjustedAccounts.push(...ticketsByCurrentAccount);
    }
  }

  private convertToAdjustedAccount(ticket: TicketTableModel): AdjustedAccountModel {
    return {
      custId: Number(this.model.selectedCustId),
      transId: ticket.betId,
      isChecked: ticket.isChecked
    } as AdjustedAccountModel;
  }

  private reCalculateAccount(winlost: bigint) {
    this.accountWinlostTable.estimateVoidAmount = Number(BigInt(this.accountWinlostTable.estimateVoidAmount) + winlost);
    this.accountWinlostTable.winLostAfterVoid = Number(BigInt(this.accountWinlostTable.currentLosing) + BigInt(this.accountWinlostTable.currentWinning) - BigInt(this.accountWinlostTable.estimateVoidAmount));
  }

  private convertStringWithCommaToNumber(value: string): number {
    return parseInt(value.replace(/,/g, ''), 10);
  }
}
