import { Component, Input, OnInit } from '@angular/core';
import { AddRequestApiService } from '../../add-request-api.service';
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
    this.accountWinlostTable = this.model.accountWinlostModels.find(x => x.custId === Number(this.model.selectedCustId));
    const x = await this.addRequestApiService.GetTicketsAbnormalAccount(Number(this.model.selectedCustId), this.model.transInfoJson);
    console.log(x);
  }
}
