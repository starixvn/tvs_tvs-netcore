import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import { SortingComponent } from 'src/utility/components/sorting/sorting/sorting.component';
import { AddRequestStore } from '../../add-request.store';
import { AccountWinlostModel } from '../models/account-winlost.model';

@Component({
  selector: 'account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.scss']
})
export class AccountTableComponent implements OnInit {
  @Input() accountWinlostModels: AccountWinlostModel[];
  @ViewChildren('sortingComponent') sortingComponents: QueryList<SortingComponent>;

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

  sorting(isDesc: boolean, orderBy: string, componentId: number): void {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.sortingComponents.filter(x => x.id !== componentId).forEach(x => x.isDesc = null);
    this.accountWinlostModels = _.orderBy(_.uniqBy(this.accountWinlostModels, x => x.custId), [orderBy], [isDesc ? 'desc' : 'asc']);
    this.addRequestStore.changeBlockingUiStatus(false);
  }
}
