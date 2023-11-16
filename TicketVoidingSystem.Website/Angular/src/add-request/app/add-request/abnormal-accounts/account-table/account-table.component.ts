import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import { SortingComponent } from '../../../../../utility/components/sorting/sorting/sorting.component';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { AccountWinlostModel } from '../models/account-winlost.model';
import { ValidationBusinessRuleArgs } from '../models/validation.model';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.scss']
})
export class AccountTableComponent {
  @Input() filter: FilterModel;
  @Input() requestId?: number;
  @Input() abnormalAccountModel: AbnormalAccountModel;
  @Input() accountWinlostModels: AccountWinlostModel[];
  @ViewChildren('sortingComponent') sortingComponents: QueryList<SortingComponent>;

  constructor(
    private readonly addRequestStore: AddRequestStore,
    private readonly appService: AddRequestApiService,
    private readonly validationService: ValidationService
  ) { }

  public async reCalculate(account: AccountWinlostModel): Promise<void> {
    if (account.adjustVoidLimit !== null) {
      this.addRequestStore.changeBlockingUiStatus(true);
      const viewModel = await this.validationService.getValidation(this.createValidationBusinessRuleArgs(account));
      const updatedAccountAmount = viewModel.accountWinlostModels.find(x => x.custId === account.custId);
      if (updatedAccountAmount) {
        account.givenCredit = updatedAccountAmount.givenCredit;
        account.currentLosing = updatedAccountAmount.currentLosing;
        account.currentWinning = updatedAccountAmount.currentWinning;
        account.estimateVoidAmount = updatedAccountAmount.estimateVoidAmount;
        account.winLostAfterVoid = updatedAccountAmount.winLostAfterVoid;
      }
      this.addRequestStore.changeBlockingUiStatus(false);
    }
  }

  public sorting(isDesc: boolean, orderBy: string, componentId: number): void {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.sortingComponents.filter(x => x.id !== componentId).forEach(x => x.isDesc = null);
    this.accountWinlostModels = _.orderBy(_.uniqBy(this.accountWinlostModels, x => x.custId), [orderBy], [isDesc ? 'desc' : 'asc']);
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  async exportExcel(): Promise<void> {
    if (this.accountWinlostModels?.length > 0) {
      await this.appService.exportAccount(this.accountWinlostModels);
    }
  }

  private createValidationBusinessRuleArgs(account: AccountWinlostModel): ValidationBusinessRuleArgs {
    const arg = new ValidationBusinessRuleArgs();
    arg.requestId = this.requestId;
    arg.actionId = this.filter.action;
    arg.abnormalAccountModel = this.abnormalAccountModel;
    arg.abnormalAccountModel.accountWinlostModels = [account];

    return arg;
  }
}
