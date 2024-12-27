import { Component, Input, OnInit } from '@angular/core';
import { AddRequestApiService } from '../../add-request-api.service';
import { TicketTableViewModel } from '../../components/ticket-table/ticket-table.model';
import { AccountWinlostModel } from '../models/account-winlost.model';
import { AccountAffectedTicketModel } from './account-affected-ticket.model';

@Component({
  selector: 'account-affected-ticket',
  templateUrl: './account-affected-ticket.component.html',
  styleUrls: ['./account-affected-ticket.component.scss']
})
export class AccountAffectedTicketComponent implements OnInit {
  @Input() model = new AccountAffectedTicketModel();
  //@Output() saveEventOutput = new EventEmitter<PoolHouseTicketsModel>();
  isBlock: boolean;
  blockBetList: boolean;
  accountWinlostTable: AccountWinlostModel;
  ticketTableViewModel = new TicketTableViewModel();
  constructor(private readonly addRequestApiService: AddRequestApiService) { }

  async ngOnInit() {
    await this.updateTable();
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

  async updateTable() {
    this.isBlock = true;
    this.accountWinlostTable = this.model.accountWinlostModels.find(x => x.custId === Number(this.model.selectedCustId));
    const result = await this.addRequestApiService.GetTicketsAbnormalAccount(Number(this.model.selectedCustId), this.model.transInfoJson);
    this.ticketTableViewModel = new TicketTableViewModel(result);
    this.isBlock = false;
  }
}
