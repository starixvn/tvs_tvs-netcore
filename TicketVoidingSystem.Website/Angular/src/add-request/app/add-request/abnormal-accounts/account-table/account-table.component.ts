import { Component, Input, OnInit } from '@angular/core';
import { AddRequestStore } from '../../add-request.store';
import { AccountWinlostModel } from '../models/account-winlost.model';

@Component({
  selector: 'account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.scss']
})
export class AccountTableComponent implements OnInit {
  @Input() accountWinlostModels: AccountWinlostModel[];
  constructor(
    private readonly addRequestStore: AddRequestStore,
  ) { }

  ngOnInit(): void {
  }

  reCalculate(userData: AccountWinlostModel): void {
    this.addRequestStore.changeBlockingUiStatus(true);
    //calc
    this.addRequestStore.changeBlockingUiStatus(false);
  }
}
